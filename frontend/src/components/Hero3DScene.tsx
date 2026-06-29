import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useMousePosition } from '../hooks/useMousePosition'

export default function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useMousePosition()
  const mouseRef = useRef({ x: 0, y: 0 })

  // Track mouse coordinates normalized (-1 to 1)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      mouseRef.current = {
        x: (mouse.x / window.innerWidth) * 2 - 1,
        y: -(mouse.y / window.innerHeight) * 2 + 1,
      }
    }
  }, [mouse])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // 1. Setup Renderer
    const width = container.clientWidth || 500
    const height = container.clientHeight || 500
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true

    // 2. Setup Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 11)

    // 3. Create Custom Procedural Shader/Displacement for Organic Metaball
    // Create Icosahedron geometry with high detail for smooth vertex displacement
    const detail = 5
    const mainGeometry = new THREE.IcosahedronGeometry(2.4, detail)
    
    // Store original positions for displacement calculations
    const originalPositions = mainGeometry.attributes.position.clone()
    const tempPos = new THREE.Vector3()
    const normalVec = new THREE.Vector3()

    // Premium Material - Glossy Glassy Metallic with Transmission
    const mainMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8a2be2, // Purple
      emissive: 0x1d003a, // Subtle emissive glow
      roughness: 0.12,
      metalness: 0.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transmission: 0.45, // Glass translucent effect
      thickness: 1.2,
      ior: 1.45,
      sheen: 1.0,
      sheenColor: 0xff007f, // Glowing Pink Sheen rim
      specularIntensity: 1.0,
      flatShading: false
    })

    const metaballMesh = new THREE.Mesh(mainGeometry, mainMaterial)
    scene.add(metaballMesh)

    // 4. Orbiting Blobs (metaball satellites)
    const blobsGroup = new THREE.Group()
    scene.add(blobsGroup)

    const blobMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff, // Cyan
      emissive: 0x002b2b,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
      clearcoat: 1.0,
      thickness: 1.0,
      sheen: 0.8,
      sheenColor: 0x00ffff
    })

    const blobs: { mesh: THREE.Mesh; orbitSpeed: number; orbitRadius: number; phaseY: number; phaseX: number }[] = []
    const blobCount = 3
    const blobGeometries = [
      new THREE.IcosahedronGeometry(0.55, 3),
      new THREE.IcosahedronGeometry(0.4, 3),
      new THREE.IcosahedronGeometry(0.48, 3)
    ]

    for (let i = 0; i < blobCount; i++) {
      const mesh = new THREE.Mesh(blobGeometries[i], blobMaterial)
      blobsGroup.add(mesh)
      blobs.push({
        mesh,
        orbitSpeed: 0.4 + i * 0.15,
        orbitRadius: 3.4 + i * 0.4,
        phaseY: Math.random() * Math.PI * 2,
        phaseX: Math.random() * Math.PI * 2
      })
    }

    // 5. Orbital Dust Particles
    const particleCount = 120
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particlePhases = new Float32Array(particleCount)
    const particleSpeeds = new Float32Array(particleCount)
    const particleRadii = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      particlePhases[i] = Math.random() * Math.PI * 2
      particleSpeeds[i] = 0.2 + Math.random() * 0.4
      particleRadii[i] = 3.6 + Math.random() * 1.5

      // Initial positions
      const angle = particlePhases[i]
      particlePositions[i * 3] = Math.cos(angle) * particleRadii[i]
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.5
      particlePositions[i * 3 + 2] = Math.sin(angle) * particleRadii[i]
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })

    const particles = new THREE.Points(particleGeo, particleMaterial)
    scene.add(particles)

    // 6. Premium Realistic Lighting
    const ambientLight = new THREE.AmbientLight(0x0f0b24, 1.2)
    scene.add(ambientLight)

    // Key light (Cyan)
    const cyanLight = new THREE.DirectionalLight(0x00ffff, 4.0)
    cyanLight.position.set(-6, 4, 5)
    scene.add(cyanLight)

    // Fill light (Pink/Magenta)
    const pinkLight = new THREE.DirectionalLight(0xff007f, 3.5)
    pinkLight.position.set(6, -4, 5)
    scene.add(pinkLight)

    // Rim lighting (White/Backlight)
    const rimLight = new THREE.DirectionalLight(0xffffff, 3.0)
    rimLight.position.set(0, 0, -10)
    scene.add(rimLight)

    // Moving point light for glowing glossy reflections
    const orbLight = new THREE.PointLight(0xbf5af2, 3.0, 15)
    scene.add(orbLight)

    // 7. Math displacement function for metaball (Sine noise layered)
    const displacementNoise = (x: number, y: number, z: number, time: number) => {
      // Create multi-frequency layered wave displacement for organic look
      const wave1 = Math.sin(x * 1.2 + time * 1.2) * Math.cos(y * 1.2 - time * 0.8) * 0.2
      const wave2 = Math.cos(z * 2.2 + time * 1.6) * Math.sin(x * 1.8 - time * 1.0) * 0.12
      const wave3 = Math.sin(y * 3.5 + time * 2.5) * 0.06
      return wave1 + wave2 + wave3
    }

    // 8. Render loop
    const clock = new THREE.Clock()
    let animationFrameId: number

    // Eased mouse offsets for damping
    let mouseEaseX = 0
    let mouseEaseY = 0
    let introProgress = 0

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      // Cinematic Intro Stage progression
      if (introProgress < 1) {
        introProgress += 0.007 // Complete intro inside 2.5 seconds
      }

      // Calculate organic displacement on vertices
      const posAttr = mainGeometry.attributes.position
      const count = posAttr.count

      for (let i = 0; i < count; i++) {
        // Read original position coordinate
        tempPos.fromBufferAttribute(originalPositions, i)
        normalVec.copy(tempPos).normalize()

        // Calculate procedural noise displacement at this point
        const disp = displacementNoise(tempPos.x, tempPos.y, tempPos.z, elapsedTime)

        // Set displaced vertex position along its normal vector
        posAttr.setXYZ(
          i,
          tempPos.x + normalVec.x * disp,
          tempPos.y + normalVec.y * disp,
          tempPos.z + normalVec.z * disp
        )
      }

      posAttr.needsUpdate = true
      mainGeometry.computeVertexNormals()

      // Slow idle rotation + breathing pulse
      metaballMesh.rotation.y = elapsedTime * 0.15
      metaballMesh.rotation.x = elapsedTime * 0.08
      
      // Stage 5 & 6: Scale transitions from 0 to normal breathing scale
      const breatheScale = (1.0 + Math.sin(elapsedTime * 1.8) * 0.04) * Math.min(1, introProgress * 1.5)
      metaballMesh.scale.set(breatheScale, breatheScale, breatheScale)

      // Orbiting satellites (Blobs) positioning
      blobs.forEach((blob, idx) => {
        const timeFactor = elapsedTime * blob.orbitSpeed
        // Orbit inwards as introProgress proceeds (Stage 4 & 5)
        const orbitRadiusFactor = Math.max(1, 2 - introProgress) * blob.orbitRadius
        const bx = Math.cos(timeFactor + blob.phaseY) * orbitRadiusFactor
        const bz = Math.sin(timeFactor + blob.phaseY) * orbitRadiusFactor
        const by = Math.sin(timeFactor * 1.4 + blob.phaseX) * 1.8

        blob.mesh.position.set(bx, by, bz)
        blob.mesh.rotation.y = elapsedTime * 0.5
        blob.mesh.rotation.x = elapsedTime * 0.3

        // Satellites slight independent breathing (stage in from 0)
        const satBreathe = (1.0 + Math.sin(elapsedTime * 2.5 + idx) * 0.1) * Math.min(1, Math.max(0, introProgress - 0.2) * 1.5)
        blob.mesh.scale.set(satBreathe, satBreathe, satBreathe)
      })

      // Orbiting dust particles positioning
      const particlePosAttr = particleGeo.attributes.position
      const pCount = particlePosAttr.count
      for (let i = 0; i < pCount; i++) {
        const speed = particleSpeeds[i]
        // Stage 4: Particles move inward toward center
        const radiusFactor = Math.max(1, 2.5 - introProgress * 1.5) * particleRadii[i]
        const phase = particlePhases[i] + elapsedTime * speed

        const px = Math.cos(phase) * radiusFactor
        const pz = Math.sin(phase) * radiusFactor
        
        // Add subtle vertical wave
        const py = Math.sin(elapsedTime * 0.8 + i) * 1.2

        particlePosAttr.setXYZ(i, px, py, pz)
      }
      particlePosAttr.needsUpdate = true

      // Stage 3 & 4: Star particle system fades in
      particleMaterial.opacity = 0.8 * Math.min(1, Math.max(0, introProgress - 0.1) * 1.5)

      // Stage 8: Lights activate dynamically
      cyanLight.intensity = 4.0 * Math.min(1, Math.max(0, introProgress - 0.3) * 2)
      pinkLight.intensity = 3.5 * Math.min(1, Math.max(0, introProgress - 0.3) * 2)
      rimLight.intensity = 3.0 * Math.min(1, Math.max(0, introProgress - 0.4) * 2)

      // Orbiting point light path
      orbLight.position.set(
        Math.cos(elapsedTime * 2.0) * 4.5,
        Math.sin(elapsedTime * 1.5) * 3.0,
        Math.sin(elapsedTime * 2.0) * 4.5
      )

      // Mouse displacement parallax with damping
      mouseEaseX += (mouseRef.current.x - mouseEaseX) * 0.05
      mouseEaseY += (mouseRef.current.y - mouseEaseY) * 0.05

      // Move camera slightly
      camera.position.x = mouseEaseX * 1.2
      camera.position.y = mouseEaseY * 1.2
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(tick)
    }

    tick()

    // 9. Handle Resize
    const handleResize = () => {
      if (!container || !canvas) return
      const w = container.clientWidth
      const h = container.clientHeight
      
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', handleResize)

    // 10. Clean up
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      mainGeometry.dispose()
      mainMaterial.dispose()
      blobGeometries.forEach(g => g.dispose())
      blobMaterial.dispose()
      particleGeo.dispose()
      particleMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">
      {/* Absolute Glow Background Spot */}
      <div className="absolute w-[80%] h-[80%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <canvas ref={canvasRef} className="relative z-10 w-full h-full block" />
    </div>
  )
}
