/**
 * Three.js 게임 캔버스 컴포넌트
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import GameEnvironment from './GameEnvironment';
import Player from './Player';

export default function GameCanvas() {
  return (
    <div className="game-canvas">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        shadows
        gl={{ antialias: true }}
      >
        {/* 조명 설정 */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* 하늘과 환경 */}
        <Sky
          sunPosition={[100, 20, 100]}
          turbidity={8}
          rayleigh={6}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
        <Environment preset="sunset" />

        {/* 게임 오브젝트 */}
        <GameEnvironment />
        <Player />

        {/* 개발용 카메라 컨트롤 (추후 제거 예정) */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={50}
        />

        {/* 디버그용 그리드 */}
        <gridHelper args={[100, 100]} />
      </Canvas>
    </div>
  );
}
