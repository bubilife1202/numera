/**
 * 플레이어 캐릭터 컴포넌트
 */

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useGameStore } from '../../stores/gameStore';
import { useInteractionStore } from '../../stores/interactionStore';

export default function Player() {
  const meshRef = useRef<Mesh>(null);
  const targetPosition = useRef(new Vector3(0, 0, 0));
  const currentPosition = useRef(new Vector3(0, 0, 0));

  const { player, updatePlayer } = useGameStore();
  const { setNearbyInteractable, nearbyInteractable } = useInteractionStore();

  // NPC 위치 (오일러)
  const npcPosition = new Vector3(-5, 1, 0);
  const interactionDistance = 2.0; // 상호작용 가능 거리

  // 키보드 입력 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const moveSpeed = 0.5;
      const newPos = currentPosition.current.clone();

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newPos.z -= moveSpeed;
          break;
        case 's':
        case 'arrowdown':
          newPos.z += moveSpeed;
          break;
        case 'a':
        case 'arrowleft':
          newPos.x -= moveSpeed;
          break;
        case 'd':
        case 'arrowright':
          newPos.x += moveSpeed;
          break;
        case 'e':
          // E키: 상호작용
          if (nearbyInteractable) {
            // 상호작용 이벤트 발생 (CustomEvent 사용)
            window.dispatchEvent(new CustomEvent('interact', {
              detail: { interactable: nearbyInteractable }
            }));
          }
          return;
        default:
          return;
      }

      // 이동 범위 제한 (튜토리얼 영역)
      newPos.x = Math.max(-5, Math.min(5, newPos.x));
      newPos.z = Math.max(-5, Math.min(5, newPos.z));

      targetPosition.current = newPos;

      // 스토어에 위치 업데이트
      updatePlayer({
        position: {
          x: newPos.x,
          y: newPos.y,
          z: newPos.z,
        },
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [updatePlayer, nearbyInteractable]);

  // 부드러운 이동 애니메이션 및 NPC 근접 감지
  useFrame(() => {
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition.current, 0.1);
      meshRef.current.position.copy(currentPosition.current);

      // 캐릭터 회전 (이동 방향을 향하도록)
      const direction = new Vector3()
        .subVectors(targetPosition.current, currentPosition.current)
        .normalize();

      if (direction.length() > 0.01) {
        const angle = Math.atan2(direction.x, direction.z);
        meshRef.current.rotation.y = angle;
      }

      // NPC와의 거리 확인
      const distanceToNPC = currentPosition.current.distanceTo(npcPosition);

      if (distanceToNPC <= interactionDistance) {
        // NPC 근처에 있음 - 상호작용 가능
        if (!nearbyInteractable) {
          setNearbyInteractable({
            id: 'npc_euler',
            type: 'npc',
            name: '오일러',
            position: { x: npcPosition.x, y: npcPosition.y, z: npcPosition.z },
          });
        }
      } else {
        // NPC에서 멀어짐 - 상호작용 불가
        if (nearbyInteractable) {
          setNearbyInteractable(null);
        }
      }
    }
  });

  return (
    <group position={[player.position.x, player.position.y, player.position.z]}>
      {/* 플레이어 캐릭터 (임시 - 추후 3D 모델로 교체) */}
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
        {/* 몸통 */}
        <capsuleGeometry args={[0.3, 1, 8, 16]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.2} />
      </mesh>

      {/* 플레이어 이름 표시 (3D 텍스트는 추후 추가) */}
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 그림자용 원 */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}
