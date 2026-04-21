import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'

function FloatingTool({ position, emoji, scale = 1 }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = Math.sin(t * 0.5 + position[0]) * 0.2
    meshRef.current.rotation.y = Math.cos(t * 0.3 + position[1]) * 0.3
    meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.2
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={meshRef} position={position} scale={scale}>
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.2} />
        </mesh>
        <Text
          position={[0, 0, 0.5]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {emoji}
        </Text>
      </group>
    </Float>
  )
}

function BookingCard() {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1
    groupRef.current.rotation.x = Math.cos(t * 0.15) * 0.05
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Card body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 2.5, 0.15]} />
          <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.1} />
        </mesh>
        {/* Header bar */}
        <mesh position={[0, 0.9, 0.08]}>
          <boxGeometry args={[2, 0.5, 0.05]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
        {/* Avatar circle */}
        <mesh position={[-0.5, 0.2, 0.1]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
        {/* Check mark */}
        <mesh position={[0.5, 0.2, 0.1]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
      </group>
    </Float>
  )
}

function Particles() {
  const count = 50
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  const pointsRef = useRef()

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#3b82f6" transparent opacity={0.6} />
    </points>
  )
}

export default function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#60a5fa" />

      <Particles />

      <FloatingTool position={[-2, 1.5, -1]} emoji="🔧" scale={0.8} />
      <FloatingTool position={[2, 1, -0.5]} emoji="⚡" scale={0.7} />
      <FloatingTool position={[-1.5, -1, -1]} emoji="🧰" scale={0.6} />
      <FloatingTool position={[1.8, -0.5, -1.2]} emoji="🔩" scale={0.5} />

      <BookingCard />
    </>
  )
}
