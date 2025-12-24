
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { ExternalIdWithScore } from '../../../types';

// --- Componentes 3D ---

const NexusNode = () => (
    <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#A78BFA" emissive="#A78BFA" emissiveIntensity={2} />
        <pointLight color="#A78BFA" intensity={100} distance={5} />
        <Sparkles count={30} scale={1.5} size={6} speed={0.4} />
    </mesh>
);

const SourceNode = ({ position, id, confidence, onHover }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <mesh 
            position={position}
            onPointerOver={() => { onHover(true); setIsHovered(true); }}
            onPointerOut={() => { onHover(false); setIsHovered(false); }}
        >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={isHovered ? 3 : 1} />
            <Html distanceFactor={10}>
                {isHovered && (
                    <div className="bg-black/50 text-white text-xs p-2 rounded-md font-data backdrop-blur-sm border border-cyan-400/50">
                        <div>Source: {id}</div>
                        <div>Confidence: {(confidence * 100).toFixed(0)}%</div>
                    </div>
                )}
            </Html>
        </mesh>
    );
};

const SynapseBeam = ({ start, end, onComplete }) => {
    const ref = useRef<THREE.Mesh>(null!);
    const vec = new THREE.Vector3().subVectors(end, start);
    const orientation = new THREE.Matrix4();
    orientation.lookAt(start, end, new THREE.Object3D().up);
    orientation.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));

    useFrame((_, delta) => {
        if (ref.current.scale.y < 1) {
            ref.current.scale.y += delta * 4; // Speed of the beam
        } else {
            ref.current.material.opacity -= delta * 2;
            if (ref.current.material.opacity <= 0) {
                onComplete();
            }
        }
    });

    return (
        <mesh ref={ref} position={start} matrix={orientation} matrixAutoUpdate={false} scale-y={0}>
            <cylinderGeometry args={[0.02, 0.02, vec.length(), 8]} />
            <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={3} transparent />
        </mesh>
    );
};

const Scene = ({ externalIds, trigger }) => {
    const [activeBeams, setActiveBeams] = useState([]);
    const sourcePositions = {
        'Google Ads': new THREE.Vector3(3, 1, -2),
        'Meta Ads': new THREE.Vector3(-3, 0.5, -1),
        'TikTok': new THREE.Vector3(2, -1.5, -3),
        'Direct': new THREE.Vector3(-1, 1.5, -4),
    };

    useEffect(() => {
        if (trigger) {
            const newBeam = {
                id: Date.now(),
                start: sourcePositions[trigger.source],
                end: new THREE.Vector3(0, 0, 0),
            };
            setActiveBeams(prev => [...prev, newBeam]);
        }
    }, [trigger]);

    const handleBeamComplete = (id) => {
        setActiveBeams(prev => prev.filter(beam => beam.id !== id));
    };
    
    const [isHovering, setIsHovering] = useState(false);
    useEffect(() => {
        document.body.style.cursor = isHovering ? 'pointer' : 'auto';
    }, [isHovering]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <NexusNode />
            {externalIds.map(extId => (
                <SourceNode
                    key={extId.source}
                    id={extId.source}
                    position={sourcePositions[extId.source]}
                    confidence={extId.confidenceScore}
                    onHover={setIsHovering}
                />
            ))}
            {activeBeams.map(beam => (
                <SynapseBeam key={beam.id} {...beam} onComplete={() => handleBeamComplete(beam.id)} />
            ))}
        </>
    );
};

// --- Componente Principal ---

interface IdentitySynapse3DProps {
    externalIds: ExternalIdWithScore[];
}

const IdentitySynapse3D: React.FC<IdentitySynapse3DProps> = ({ externalIds }) => {
    const [trigger, setTrigger] = useState(null);

    // Mock Engine para disparar a animação
    useEffect(() => {
        const interval = setInterval(() => {
            const randomSource = externalIds[Math.floor(Math.random() * externalIds.length)];
            setTrigger(randomSource);
        }, 3000);
        return () => clearInterval(interval);
    }, [externalIds]);

    return (
        <div className="h-[400px] relative bg-cyan-400/5 border border-cyan-400/20 rounded-lg backdrop-blur-xl shadow-lg shadow-cyan-500/5 p-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-4 left-4 z-10"
            >
                <h3 className="text-sm font-semibold text-gray-300">Identity Synapse Graph</h3>
                <p className="text-xs text-gray-500">Real-time identity resolution</p>
            </motion.div>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <Suspense fallback={null}>
                    <Scene externalIds={externalIds} trigger={trigger} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default IdentitySynapse3D;
