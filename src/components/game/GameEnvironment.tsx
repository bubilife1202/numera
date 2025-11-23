/**
 * 게임 환경 (지형, 구조물 등)
 */

import { useRef } from 'react';
import { Mesh } from 'three';

export default function GameEnvironment() {
  const groundRef = useRef<Mesh>(null);

  return (
    <group>
      {/* 바닥 */}
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* 튜토리얼 영역 표시 */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[10, 0.2, 10]} />
        <meshStandardMaterial color="#6366f1" opacity={0.3} transparent />
      </mesh>

      {/* 샘플 구조물: 부서진 다리 (추후 퀘스트용) */}
      <group position={[5, 0, 0]}>
        <mesh position={[-2, 0.5, 0]} castShadow>
          <boxGeometry args={[3, 1, 2]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>

        {/* 끊어진 부분 */}
        <mesh position={[2, 0.5, 0]} castShadow>
          <boxGeometry args={[3, 1, 2]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
      </group>

      {/* NPC 위치 표시자 */}
      <mesh position={[-5, 1, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}
