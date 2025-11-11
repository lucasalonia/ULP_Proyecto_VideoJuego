
class Escena extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {

        this.load.image('mapaSL', '/img/mapa/mapaSanLuis.png');
        this.load.spritesheet('blocks', 'assets/sprites/heartstar.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('Ayacucho', '/img/mapa/ayacuchoMapa.png');
        this.load.image('Junin', '/img/mapa/juninMapa.png');
        this.load.image('San Martin', '/img/mapa/sanMartinMapa.png');
        this.load.image('Dupuy', '/img/mapa/dupuyMapa.png');
        this.load.image('Pueyrredon', '/img/mapa/pueyrredonMapa.png');
        this.load.image('Pedernera', '/img/mapa/pederneraMapa.png');
        this.load.image('Chacabuco', '/img/mapa/chacabucoMapa.png');
        this.load.image('Belgrano', '/img/mapa/belgranoMapa.png');
        this.load.image('Pringles', '/img/mapa/pringlesMapa.png');
        this.load.image('hoja', '/img/mapa/hoja1.png');
        this.load.image('marco', '/img/mapa/marcoL.png');
        this.load.image('sticker', '/img/mapa/sticker.png');



    }

    create() {
        this.fechaInicio = new Date();
        const canvaWidth = this.sys.game.config.width;
        const canvaHeight = this.sys.game.config.height;
        const hoja = this.add.sprite(canvaWidth / 2, canvaHeight / 2 + 10, 'hoja').setDepth(0).setScale(0.8)
        this.contador = 0;
        const fondo = this.add.sprite(canvaWidth / 2, canvaHeight / 2, 'mapaSL').setScale(0.95);
        const marco = this.add.sprite(canvaWidth / 2 - 40, canvaHeight / 2 - 30, 'marco').setScale(0.9);
        fondo.setScale(0.5).setOrigin(0.5, 0.5);
        const left = fondo.x - fondo.displayWidth * fondo.originX;
        const right = fondo.x + fondo.displayWidth * (1 - fondo.originX);
        const top = fondo.y - fondo.displayHeight * fondo.originY;
        const bottom = fondo.y + fondo.displayHeight * (1 - fondo.originY);


        // Contorno
        // const graphics = this.add.graphics();
        // graphics.lineStyle(2, 0xff0000);
        // graphics.strokeRect(fondo.x, fondo.y, fondo.displayWidth, fondo.displayHeight);
        // graphics.strokeRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        //Zonas objetivo
        const zona1 = new Phaser.Geom.Rectangle(663, 116, 100, 100);//junin
        const zona2 = new Phaser.Geom.Rectangle(547, 126, 100, 100);//ayacucho
        const zona3 = new Phaser.Geom.Rectangle(641, 178, 64, 64);//san martin
        const zona4 = new Phaser.Geom.Rectangle(625, 473, 64, 64);//dupuy
        const zona5 = new Phaser.Geom.Rectangle(557, 315, 64, 64);//pueyrredon
        const zona6 = new Phaser.Geom.Rectangle(657, 310, 64, 64);
        const zona7 = new Phaser.Geom.Rectangle(687, 192, 64, 64);//chacabuco
        const zona8 = new Phaser.Geom.Rectangle(550, 195, 64, 64);//belgrano
        const zona9 = new Phaser.Geom.Rectangle(623, 232, 64, 64);//pringles



        // this.add.graphics().lineStyle(2, 0xff0000)
        //     .strokeRectShape(zona1)
        //     .strokeRectShape(zona2)
        //     .strokeRectShape(zona3)
        //     .strokeRectShape(zona4)
        //     .strokeRectShape(zona5)
        //     .strokeRectShape(zona6)
        //     .strokeRectShape(zona7)
        //     .strokeRectShape(zona8)
        //     .strokeRectShape(zona9);



        // Objetos arrastrables
        this.ayacucho = this.add.sprite(250, 250, 'Ayacucho').setOrigin(0.5).setScale(0.32);
        this.ayacucho.depId = 2;
        this.ayacucho.color = 0x0E88EC;

        this.junin = this.add.sprite(950, 150, 'Junin').setOrigin(0.5).setScale(0.32);
        this.junin.depId = 6;
        this.junin.color = 0xFFCA7B;


        this.sanMartin = this.add.sprite(950, 400, 'San Martin').setOrigin(0.5).setScale(0.32);
        this.sanMartin.depId = 9;
        this.sanMartin.color = 0xA260F5;

        this.dupuy = this.add.sprite(250, 400, 'Dupuy').setOrigin(0.5).setScale(0.32);
        this.dupuy.depId = 5;
        this.dupuy.color = 0xE4F10E;

        this.pueyrredon = this.add.sprite(1050, 300, 'Pueyrredon').setOrigin(0.5).setScale(0.32);
        this.pueyrredon.depId = 8;
        this.pueyrredon.color = 0x488D2D;

        this.pedernera = this.add.sprite(1050, 500, 'Pedernera').setOrigin(0.5).setScale(0.32);
        this.pedernera.depId = 7;
        this.pedernera.color = 0xDF9CB8;

        this.chacabuco = this.add.sprite(1100, 150, 'Chacabuco').setOrigin(0.5).setScale(0.32);
        this.chacabuco.depId = 4;
        this.chacabuco.color = 0xCC448E;

        this.belgrano = this.add.sprite(300, 610, 'Belgrano').setOrigin(0.5).setScale(0.32);
        this.belgrano.depId = 3;
        this.belgrano.color = 0x9E8982;

        this.pringles = this.add.sprite(300, 150, 'Pringles').setOrigin(0.5).setScale(0.32);
        this.pringles.depId = 1;
        this.pringles.color = 0x1598DB;





        // Asignarles una zona específica
        this.ayacucho.targetZone = zona2;
        this.junin.targetZone = zona1;
        this.sanMartin.targetZone = zona3;
        this.dupuy.targetZone = zona4;
        this.pueyrredon.targetZone = zona5;
        this.pedernera.targetZone = zona6;
        this.chacabuco.targetZone = zona7;
        this.belgrano.targetZone = zona8;
        this.pringles.targetZone = zona9;

        // Hacerlos arrastrables
        [this.ayacucho, this.junin, this.sanMartin, this.dupuy, this.pueyrredon, this.pedernera, this.chacabuco, this.belgrano, this.pringles].forEach(obj => {
            obj.setInteractive({ draggable: true, pixelPerfect: true });
            obj.setDepth(10);


            // // Dibujar un contorno
            // const graphics = this.add.graphics();
            // graphics.lineStyle(4, 0xff0000, 1); // ancho, color, opacidad
            // graphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        });




        // Drag y snap
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            dragX = Phaser.Math.Snap.To(dragX, 10);
            dragY = Phaser.Math.Snap.To(dragY, 10);
            gameObject.setPosition(dragX, dragY);
        });

        // Dragend
        this.input.on('dragend', (pointer, gameObject) => {
            const zona = gameObject.targetZone;
            const zoneCenterX = zona.centerX;
            const zoneCenterY = zona.centerY;

            // Distancia entre el objeto y el centro de la zona
            const dist = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, zoneCenterX, zoneCenterY);

            //Tolerancia de encaje
            const tolerancia = 80;

            if (dist < tolerancia) {
                // Rango
                gameObject.setPosition(zoneCenterX, zoneCenterY);
                gameObject.input.draggable = false;
                gameObject.setDepth(1);
                this.contador += 1;
                console.log(`${gameObject.texture.key} encajó en su zona`);
                console.log('contador:', this.contador);
            } else {
                // Si no, vuelve a su posición original
                gameObject.setPosition(gameObject.input.dragStartX, gameObject.input.dragStartY);
            }


            if (this.contador === 9) {
                const fechaFin = new Date();
                const tiempoMs = fechaFin - this.fechaInicio; // milisegundos transcurridos
                const tiempoSegundos = Math.floor(tiempoMs / 1000);
                const datos = {
                    id_jugador: 1,  // asegurate de tenerlo guardado (por ejemplo en sesión)
                    fecha_inicio: this.fechaInicio.toISOString(),
                    fecha_fin: fechaFin.toISOString(),
                    tiempo: tiempoSegundos
                };
                fetch("/tiempo_mapa", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                })
                    .then(res => res.json())
                    .then(respuesta => {
                        console.log("Tiempo guardado:", respuesta);
                    })
                    .catch(err => {
                        console.error("Error al guardar tiempo:", err);
                    });

                const sticker = this.add.sprite(300, 200, 'sticker').setScale(0.9);
                var botonNo = null;
                var botonSi = null;
                let msj2 = null;
                let msj3 = null;
                let mensajeComarca = null;
                const mensaje =
                    this.add.text(300, 200, '¡FELICITACIONES!\n  COMPLETASTE\n   EL MAPA',
                        { fontSize: '30px', fill: '#000000ff' }).setOrigin(0.5).setDepth(20);

                [this.ayacucho, this.junin, this.sanMartin, this.dupuy, this.pueyrredon,
                this.pedernera, this.chacabuco, this.belgrano, this.pringles].forEach(obj => {
                    obj.on('pointerover', () => { obj.setTintFill(obj.color) });

                    obj.on('pointerout', () => { obj.clearTint() });
                    console.log(`${obj.texture.key} clickeado `);

                    obj.on('pointerdown', () => {
                        const sticker2 = this.add.sprite(1000, 400, 'sticker').setScale(0.75);
                        if (mensajeComarca) {
                            mensajeComarca.destroy();
                            botonSi.destroy();
                            botonNo.destroy();

                        }
                        mensajeComarca =
                            this.add.text(1000, 400, `Deseas jugar\n     en\n ${obj.texture.key}?`,
                                {
                                    fontSize: '30px',
                                    fill: '#000000ff',

                                }).setOrigin(0.5).setDepth(20);

                        botonSi = this.add.text(950, 500, "SI", {

                            fontSize: '15px',
                            color: '#080808ff',
                            align: 'center',
                            fixedWidth: 100,
                            backgroundColor: '#3ed348ff'
                        }).setPadding(10).setOrigin(0.5);

                        botonSi.setInteractive({ useHandCursor: true });

                        botonSi.on('pointerover', () => {
                            botonSi.setBackgroundColor('#8d8d8d');
                        });

                        botonSi.on('pointerout', () => {
                            botonSi.setBackgroundColor('#2d2d2d');
                        });
                        botonSi.on('pointerdown', () => {
                            window.location.href = `/departamento/${obj.depId}`;
                        }
                        )
                        botonNo = this.add.text(995, 500, "NO", {

                            fontSize: '15px',
                            color: '#ffffff',
                            align: 'center',
                            fixedWidth: 100,
                            backgroundColor: '#2d2d2d'
                        }).setPadding(10).setOrigin(0.5);

                        botonNo.setInteractive({ useHandCursor: true });

                        botonNo.on('pointerover', () => {
                            botonNo.setBackgroundColor('#8d8d8d');
                        });

                        botonNo.on('pointerout', () => {
                            botonNo.setBackgroundColor('#2d2d2d');
                        });
                        botonNo.on('pointerdown', () => {
                            botonSi.destroy();
                            mensajeComarca.destroy();
                            botonNo.destroy();
                        }
                        )

                        console.log(`${obj.texture.key} clickeado`);
                        if (msj2) { msj2.destroy() };
                        //  mensaje.destroy();

                        msj2 = this.add.text(obj.targetZone.centerX, obj.targetZone.centerY,

                            ` ${obj.texture.key}`, { fontSize: '20px', fill: '#000000ff', backgroundColor: " #baecb4ff", fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setOrigin(0.5).setDepth(20);

                    })
                })



            }
        }
        );
    }
}
function resize() {
    const canvas = document.querySelector("canvas");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const windowRatio = windowWidth / windowHeight;
    const gameRatio = config.width / config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = '${windowWidth}px';
        canvas.style.height = '${windowWidth / gameRatio}px';
    } else {
        canvas.style.width = '${windowHeight * gameRatio}px';
        canvas.style.height = '${windowHeight}px';
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'phaser-container',
    backgroundColor: '#d9fafb',
    scene: Escena,

};

new Phaser.Game(config);


function applyCssScale() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const scale = Math.min(ww / config.width, wh / config.height);

    // TAMAÑO DE CANVA BASE
    canvas.style.width = config.width + 'px';
    canvas.style.height = config.height + 'px';

    // TRANSFORM DE ESCALA
    canvas.style.transformOrigin = 'top left';
    canvas.style.transform = `scale(${scale})`;

    // CENTRA
    const offsetX = (ww - config.width * scale) / 2;
    const offsetY = (wh - config.height * scale) / 2;
    canvas.style.position = 'absolute';
    canvas.style.left = `${offsetX}px`;
    canvas.style.top = `${offsetY}px`;
}

// CREA CANVA Y AJUSTA ESCALA
function waitForCanvasThenApply() {
    const check = setInterval(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            clearInterval(check);
            applyCssScale();
            window.addEventListener('resize', applyCssScale);
        }
    }, 50);
}

waitForCanvasThenApply();

