"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

function MouseParticles({ count = 3000 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const { viewport, mouse, size } = useThree()
  
  // Create geometry and material
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const [particles] = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        factor: 20 + Math.random() * 100,
        speed: 0.01 + Math.random() / 200,
        xFactor: -50 + Math.random() * 100,
        yFactor: -50 + Math.random() * 100,
        zFactor: -50 + Math.random() * 100,
        mx: 0,
        my: 0,
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.8, 0.4 + Math.random() * 0.2) // Dark blues and vibrant blues
      })
    }
    return [temp]
  }, [count])
  
  // We need to store colors to an instanced attribute
  const colorArray = useMemo(() => {
    const array = new Float32Array(count * 3)
    particles.forEach((p, i) => {
      p.color.toArray(array, i * 3)
    })
    return array
  }, [count, particles])

  const targetMouse = useRef(new THREE.Vector2(0, 0))

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse to [-1, 1] range
      targetMouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      targetMouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame(() => {
    if (!mesh.current) return
    
    // Convert normalized mouse to world coordinates (roughly)
    const mouseX = (targetMouse.current.x * viewport.width) / 2
    const mouseY = (targetMouse.current.y * viewport.height) / 2

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      
      // Calculate position
      let x = (xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10) / 4
      let y = (yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10) / 4
      let z = (zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10) / 4
      
      // Mouse interaction: attract or repel
      const dx = mouseX - x
      const dy = mouseY - y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      // When mouse is near, pull particles slightly and swirl them
      if (dist < 4) {
         x += dx * 0.05
         y += dy * 0.05
      }
      
      // Slow background rotation
      dummy.position.set(x, y, z)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.scale.set(0.05, 0.05, 0.05)
      dummy.updateMatrix()
      
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.5, 8, 8]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </sphereGeometry>
      <meshBasicMaterial vertexColors toneMapped={false} transparent opacity={0.6} />
    </instancedMesh>
  )
}

function ConnectingLines({ count = 100 }: { count?: number }) {
    const linesRef = useRef<THREE.LineSegments>(null!)
    const { viewport } = useThree()
    
    // Abstract network graph behind the particles
    const [positions] = useMemo(() => {
        const pos = new Float32Array(count * 6)
        for (let i = 0; i < count; i++) {
            // Start point
            pos[i * 6] = (Math.random() - 0.5) * 25
            pos[i * 6 + 1] = (Math.random() - 0.5) * 25
            pos[i * 6 + 2] = (Math.random() - 0.5) * 10 - 5
            
            // End point (connected nearby)
            pos[i * 6 + 3] = pos[i * 6] + (Math.random() - 0.5) * 5
            pos[i * 6 + 4] = pos[i * 6 + 1] + (Math.random() - 0.5) * 5
            pos[i * 6 + 5] = pos[i * 6 + 2] + (Math.random() - 0.5) * 5
        }
        return [pos]
    }, [count])

    useFrame(({ clock }) => {
        if(linesRef.current) {
            linesRef.current.rotation.y = clock.getElapsedTime() * 0.05
            linesRef.current.rotation.x = clock.getElapsedTime() * 0.02
        }
    })

    return (
        <lineSegments ref={linesRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count * 2} array={positions} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color="#3B82F6" transparent opacity={0.15} />
        </lineSegments>
    )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Fallback gradient for very fast loads */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAFBFC] via-[#F1F5F9] to-[#E2E8F0]" />
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#FAFBFC", 10, 30]} />
        <ambientLight intensity={1} />
        <MouseParticles count={2500} />
        <ConnectingLines count={150} />
      </Canvas>
    </div>
  )
}
