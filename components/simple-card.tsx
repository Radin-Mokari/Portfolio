"use client"

import * as THREE from "three"
import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, useTexture } from "@react-three/drei"

export default function SimpleCard() {
  const cardRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Load assets
  const { nodes, materials } = useGLTF("/assets/3d/card.glb")
  const texture = useTexture("/assets/images/tag_texture.png")

  // Simple floating animation
  useFrame((state) => {
    if (cardRef.current && !clicked) {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.5
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Simple lanyard line */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 4]} />
        <meshBasicMaterial color="white" map={texture} />
      </mesh>
      
      {/* Card */}
      <group
        ref={cardRef}
        position={[0, -1, 0]}
        scale={2.25}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
        style={{ cursor: hovered ? 'grab' : 'default' }}
      >
        {/* @ts-expect-error - GLTF nodes */}
        <mesh geometry={nodes.card?.geometry}>
          <meshPhysicalMaterial
            // @ts-expect-error - GLTF materials
            map={materials.base?.map}
            clearcoat={1}
            clearcoatRoughness={0.15}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
        <mesh
          // @ts-expect-error - GLTF nodes
          geometry={nodes.clip?.geometry}
          material={materials.metal}
        />
        <mesh 
          // @ts-expect-error - GLTF nodes
          geometry={nodes.clamp?.geometry} 
          material={materials.metal} 
        />
      </group>
    </group>
  )
}
