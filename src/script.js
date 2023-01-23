import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import * as Stats from 'stats-js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

let loading_switch      = false;
const canvas            = document.querySelector('canvas.webgl')
const loading_manager   = new THREE.LoadingManager();
const scene             = new THREE.Scene()
const gui               = new dat.GUI()
const stats             = new Stats()
const clock             = new THREE.Clock()
const renderer          = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
const camera            = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 100);
const controls          = new OrbitControls(camera, canvas)
const gltfLoader        = new GLTFLoader(loading_manager)
const fbxLoader         = new FBXLoader(loading_manager)


// const dracoLoader   = new DRACOLoader()
const textureLoader = new THREE.TextureLoader(loading_manager)

const sizes         = { width: window.innerWidth, height: window.innerHeight }
const cursor        = { x: 0, y: 0 }
let scrollY         = null;

loading_manager.onLoad = function (url, loaded_items, total_items) {
    console.log("All items loaded successfully.")
    loading_switch = true;
}

// Gradients
const bowl_gradient         = textureLoader.load('Model Resources/Toon Style Gradients/Bowl-Gradient.jpg');
const grey_gradient         = textureLoader.load('Model Resources/Toon Style Gradients/Grey-Outline-Gradient.jpg');
const chive_gradient        = textureLoader.load('Model Resources/Toon Style Gradients/Chive-Gradient.jpg');
const noodle_gradient       = textureLoader.load('Model Resources/Toon Style Gradients/Noodle-Gradient.jpg');
bowl_gradient.magFilter     = THREE.NearestFilter;
grey_gradient.magFilter     = THREE.NearestFilter;
chive_gradient.magFilter    = THREE.NearestFilter;
noodle_gradient.magFilter   = THREE.NearestFilter;

// Toon Materials
const bowl_toon_material    = new THREE.MeshToonMaterial({ gradientMap: bowl_gradient });
const chive_toon_material   = new THREE.MeshToonMaterial({ gradientMap: chive_gradient });
const noodle_toon_material  = new THREE.MeshToonMaterial({ gradientMap: noodle_gradient });
const grey_outline_toon     = new THREE.MeshToonMaterial({ gradientMap: grey_gradient }); // Experimental Material


// Textures
const bowl_texture          = textureLoader.load('Model Resources/Model Textures/ultrawide-bowl-texture-2262.png');
const corn_texture          = textureLoader.load('Model Resources/Model Textures/corn-texture-1024.jpg');
const sushi_texture         = textureLoader.load('Model Resources/Model Textures/sushi-texture-1024.jpg');

bowl_texture.flipY          = false;
corn_texture.flipY          = false;
sushi_texture.flipY         = false;

// Materials
const bowl_texture_material     = new THREE.MeshBasicMaterial({ map: bowl_texture });
const corn_texture_material     = new THREE.MeshBasicMaterial({ map: corn_texture });
const sushi_texture_material    = new THREE.MeshBasicMaterial({ map: sushi_texture });


stats.showPanel( 1 )
document.body.appendChild( stats.dom );

renderer.setClearAlpha(0)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

controls.enableDamping = true;


// dracoLoader.setDecoderPath('./draco/')
// gltfLoader.setDRACOLoader(dracoLoader)



const axesHelper                    = new THREE.AxesHelper(10)
const directionalLight              = new THREE.DirectionalLight('#f2e9e9', 0.5);
const directionalLightHelper        = new THREE.DirectionalLightHelper(directionalLight, 5);
directionalLight.position.set(0,15,0);
scene.add(axesHelper, directionalLight, directionalLightHelper)


let noodlesMixer;
let animations = {
    noodle: null,
};


// gltfLoader.load('GLTF Models/noodles-animation-optimized-smooth.glb', (gltf) => {
//     noodlesMixer = new THREE.AnimationMixer(gltf.scene.children[0].children[20])
//     let noodle_animation = noodlesMixer.clipAction(gltf.animations[0])
//     console.log(animations.noodle)
//     noodle_animation.play()

//     gltf.scene.children[0].children[20].material = noodle_toon_material;
//     scene.add(gltf.scene)

// })

gltfLoader.load('GLTF Models/temp.glb', (gltf => {
    console.log(gltf)
    noodlesMixer = new THREE.AnimationMixer(gltf.scene.children[1])
    console.log(gltf.animations[0])
    // let noodle_animation = noodlesMixer.clipAction(gltf.animations[0])
    // noodle_animation.play()
    scene.add(gltf.scene)
}))

// fbxLoader.load('GLTF Models/temp-2.fbx', (fbx) => {
//     scene.add(fbx)
//     console.log(fbx)
// })




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

camera.position.set(41.3, -0.5, 34.8)

scene.add(camera)



const tick = () =>
{
    stats.begin()

    renderer.render(scene, camera)
    controls.update()
    

    if (loading_switch) {
       noodlesMixer.update(clock.getDelta())
    }

    stats.end()

    window.requestAnimationFrame(tick)
}

tick()