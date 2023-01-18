import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import * as Stats from 'stats-js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const canvas        = document.querySelector('canvas.webgl')
const scene         = new THREE.Scene()
const gui           = new dat.GUI()
const stats         = new Stats()
const clock         = new THREE.Clock()
const renderer      = new THREE.WebGLRenderer({ canvas: canvas })
const camera        = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100)
const controls      = new OrbitControls(camera, canvas)
const gltfLoader    = new GLTFLoader()
// const dracoLoader   = new DRACOLoader()
const textureLoader = new THREE.TextureLoader()

const sizes         = { width: window.innerWidth, height: window.innerHeight }
const cursor        = { x: 0, y: 0 }
let scrollY         = null;

// Gradients
const bowl_gradient         = textureLoader.load('Model Resources/Toon Style Gradients/Bowl-Gradient.jpg')
const grey_gradient         = textureLoader.load('Model Resources/Toon Style Gradients/Grey-Outline-Gradient.jpg')
bowl_gradient.magFilter     = THREE.NearestFilter
grey_gradient.magFilter     = THREE.NearestFilter

// Toon Materials
const bowl_toon_material    = new THREE.MeshToonMaterial({ gradientMap: bowl_gradient })
const grey_outline_toon     = new THREE.MeshToonMaterial({ gradientMap: grey_gradient })

// Textures
const bowl_texture          = textureLoader.load('Model Resources/Model Textures/ultrawide-bowl-texture-2262.png')

bowl_texture.flipY          = false

// Materials
const bowl_texture_material = new THREE.MeshBasicMaterial({ map: bowl_texture })


stats.showPanel( 1 )
document.body.appendChild( stats.dom );

renderer.setClearAlpha(0)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

controls.enableDamping = true;


// dracoLoader.setDecoderPath('./draco/')
// gltfLoader.setDRACOLoader(dracoLoader)



const axesHelper                    = new THREE.AxesHelper(10)
const directionalLight              = new THREE.DirectionalLight('#ffffff', 0.5);
const directionalLightHelper        = new THREE.DirectionalLightHelper(directionalLight, 5);
directionalLight.position.set(0,10,0);
scene.add(axesHelper, directionalLight, directionalLightHelper)


gltfLoader.load('Model Resources/Bowl.glb', (gltf => {
    const bowl_shell_mesh       = gltf.scene.children.find(child => child.name === 'High_Res_Bowl_1');
    const bowl_texture_mesh     = gltf.scene.children.find(child => child.name === 'High_Res_Bowl_2');
    const black_outline         = gltf.scene.children.find(child => child.name === 'High_Res_Bowl_Outline_Black');
    const grey_outline          = gltf.scene.children.find(child => child.name === 'High_Res_Bowl_Outline_Grey');

    bowl_shell_mesh.material    = bowl_toon_material;
    bowl_texture_mesh.material  = bowl_texture_material;
    black_outline.material      = new THREE.MeshBasicMaterial({ color: '#000000' });
    grey_outline.material       = grey_outline_toon

    console.log(gltf.scene)
    scene.add(gltf.scene)

}))


// const cube = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: '#ff0000' }) )
// scene.add(cube)




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

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
})

window.addEventListener('mousemove', (e) => {
   cursor.x = e.clientX / sizes.width - 0.5;    
   cursor.y = e.clientY / sizes.height - 0.5;
})

camera.position.z = 6
scene.add(camera)



const tick = () =>
{
    stats.begin()

    renderer.render(scene, camera)
    controls.update()

    stats.end()

    window.requestAnimationFrame(tick)
}

tick()