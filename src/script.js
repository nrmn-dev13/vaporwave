import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import terrainVertex  from './shaders/terrain/vertex.glsl'
import terrainFragment from './shaders/terrain/fragment.glsl'
import sunVertex  from './shaders/sun/vertex.glsl'
import sunFragment from './shaders/sun/fragment.glsl'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const terrainTexture = textureLoader.load('/textures/grid.png')

/**
 * Terrain
 */
// Geometry
const geometry = new THREE.PlaneGeometry(20, 20, 64, 64)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for(let i = 0; i < count; i++)
{
    randoms[i] = Math.random()
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))


const terrainMaterial = new THREE.RawShaderMaterial({
		side: THREE.DoubleSide,
    vertexShader: terrainVertex,
    fragmentShader: terrainFragment,		
		uniforms: {
			uFrequency : { value: new THREE.Vector2(10, 5) },
			uTime: { value: 0 },
			uColor: {value: new THREE.Color('orange')},
			uTexture: {value: terrainTexture }
		}
})

gui.add(terrainMaterial.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX')
gui.add(terrainMaterial.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY')

// Mesh
const mesh = new THREE.Mesh(geometry, terrainMaterial)
mesh.position.y = -1.5
mesh.position.z = -5
mesh.rotation.x = 5
mesh.rotation.z = 7.85
scene.add(mesh)
gui.add(mesh.position, 'y').min(-5).max(20).step(0.01).name('y')
gui.add(mesh.position, 'z').min(-5).max(20).step(0.01).name('z')
gui.add(mesh.rotation, 'x').min(0).max(20).step(0.01).name('rotateX')
gui.add(mesh.rotation, 'z').min(0).max(20).step(0.01).name('rotateZ')

/**
 * Sun
 */
// 

const sunGeometry = new THREE.CircleGeometry( 3, 61 );
const sunMaterial = new THREE.RawShaderMaterial({
	side: THREE.DoubleSide,
	vertexShader: sunVertex,
	fragmentShader: sunFragment,		
	uniforms: {
		uFrequency : { value: new THREE.Vector2(10, 5) },
		uTime: { value: 0 },
		uColor: {value: new THREE.Color('red')}
	}
})
const sun = new THREE.Mesh( sunGeometry, sunMaterial );
sun.position.z = -15
sun.position.y = 5
scene.add( sun );
gui.add(sun.position, 'z').min(-20).max(20).step(0.01).name('sunZ')
gui.add(sun.position, 'y').min(-5).max(20).step(0.01).name('sunY')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

		terrainMaterial.uniforms.uTime.value = elapsedTime * 3

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()