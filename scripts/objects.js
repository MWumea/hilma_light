// scripts/objects.js

function loadAndPlacePlants(scene, roomSize) {
    const loader = new THREE.GLTFLoader();
    const cornerOffset = 0.5; // 50 cm från väggen
    
    const plantPath = 'models/free_pothos_potted_plant_money_plant.glb';

    // Ladda modellen en gång
    loader.load(
        plantPath,
        function (gltf) {
            // Vi använder hela den laddade scenen, vilket löser problemen med
            // saknade växtdelar, felaktig rotation och fel pivotpunkt.
            const plantModel = gltf.scene;
            
            // Vi ser till att skuggor är avstängda för att optimera prestanda.
            plantModel.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = false;
                    child.receiveShadow = false; 
                }
            });

            // ===== START PÅ KORRIGERING (FELSTAVNING) =====
            // Här fanns felet som gömde den fjärde krukan.
            // Sista raden hade ett '+' istället för ett '-'.
            const positions = [
                new THREE.Vector3(roomSize.width - cornerOffset, 0, roomSize.depth - cornerOffset),   // Bakre högra
                new THREE.Vector3(-roomSize.width + cornerOffset, 0, roomSize.depth - cornerOffset),  // Bakre vänstra
                new THREE.Vector3(roomSize.width - cornerOffset, 0, -roomSize.depth + cornerOffset),  // Främre högra
                new THREE.Vector3(-roomSize.width + cornerOffset, 0, -roomSize.depth + cornerOffset)  // Främre vänstra (KORRIGERAD)
            ];
            // ===== SLUT PÅ KORRIGERING (FELSTAVNING) =====

            // Skapa en klon av modellen för varje position
            positions.forEach(pos => {
                const plant = plantModel.clone(); // Vi använder clone() som är mer robust för denna modell
                plant.position.copy(pos);
                plant.scale.set(1.0, 1.0, 1.0); 

                scene.add(plant);
            });
            
            console.log(`Alla 4 växter har laddats och placerats ut korrekt.`);
        },
        undefined, 
        function (error) {
            console.error(`Ett fel uppstod vid laddning av modellen ${plantPath}:`, error);
        }
    );
}