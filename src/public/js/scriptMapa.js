
class Escena extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {

        this.load.image('bg', '/img/mapa/San_Luis.png');
        this.load.spritesheet('blocks', 'assets/sprites/heartstar.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('Ayacucho', '/img/mapa/ayacuchoMapa.png');
        this.load.image('Junin', '/img/mapa/junin.png');
        this.load.image('San Martin', '/img/mapa/sanMartin.png');
        this.load.image('Dupuy', '/img/mapa/dupuyMapa.png');
        this.load.image('Pueyrredon', '/img/mapa/pueyrredonMapa.png');
        this.load.image('Pedernera', '/img/mapa/pederneraMapa.png');
        this.load.image('Chacabuco', '/img/mapa/chacabucoMapa.png');
        this.load.image('Belgrano', '/img/mapa/belgranoMapa.png');
        this.load.image('Pringles', '/img/mapa/pringlesMapa.png');



    }


    create() {
        this.contador = 0;
        const fondo = this.add.sprite(-50, 30, 'bg');
        fondo.setScale(1.27);
        fondo.setOrigin(0, 0);

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
        const zona1 = new Phaser.Geom.Rectangle(850, 290, 100, 100);
        const zona2 = new Phaser.Geom.Rectangle(400, 330, 100, 100);
        const zona3 = new Phaser.Geom.Rectangle(727, 480, 64, 64);
        const zona4 = new Phaser.Geom.Rectangle(655, 1650, 64, 64);
        const zona5 = new Phaser.Geom.Rectangle(405, 1048, 64, 64);
        const zona6 = new Phaser.Geom.Rectangle(770, 1005, 64, 64);
        const zona7 = new Phaser.Geom.Rectangle(898, 530, 64, 64);
        const zona8 = new Phaser.Geom.Rectangle(340, 549, 64, 64);
        const zona9 = new Phaser.Geom.Rectangle(663, 700, 64, 64);



        // this.add.graphics().lineStyle(2, 0xff0000)
        //     .strokeRectShape(zona1)
        //     .strokeRectShape(zona2)
        //     .strokeRectShape(zona3)
        //     .strokeRectShape(zona4)
        //     .strokeRectShape(zona5)
        //     .strokeRectShape(zona6)
        //     .strokeRectShape(zona7)
        //     .strokeRectShape(zona8)
        // .strokeRectShape(zona9);



        // Objetos arrastrables
        this.ayacucho = this.add.sprite(1800, 250, 'Ayacucho').setOrigin(0.5).setScale(1.5);
        this.ayacucho.depId = 2;

        this.junin = this.add.sprite(2200, 600, 'Junin').setOrigin(0.5).setScale(1.5);
        this.junin.depId = 6;

        this.sanMartin = this.add.sprite(1700, 1100, 'San Martin').setOrigin(0.5).setScale(1.5);
        this.sanMartin.depId = 9;

        this.dupuy = this.add.sprite(1700, 1600, 'Dupuy').setOrigin(0.5).setScale(1.5);
        this.dupuy.depId = 5;

        this.pueyrredon = this.add.sprite(2200, 1200, 'Pueyrredon').setOrigin(0.5).setScale(1.5);
        this.pueyrredon.depId = 8;

        this.pedernera = this.add.sprite(2600, 1400, 'Pedernera').setOrigin(0.5).setScale(1.5);
        this.pedernera.depId = 7;

        this.chacabuco = this.add.sprite(2600, 800, 'Chacabuco').setOrigin(0.5).setScale(1.5);
        this.chacabuco.depId = 4;

        this.belgrano = this.add.sprite(1800, 610, 'Belgrano').setOrigin(0.5).setScale(1.5);
        this.belgrano.depId = 3;

        this.pringles = this.add.sprite(2500, 250, 'Pringles').setOrigin(0.5).setScale(1.5);
        this.pringles.depId = 1;





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
            dragX = Phaser.Math.Snap.To(dragX, 40);
            dragY = Phaser.Math.Snap.To(dragY, 40);
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

                var buttonNo = null;
                var button = null;
                let msj2 = null;
                let msj3 = null;
                let mensajeComarca = null;
                const mensaje =
                    this.add.text(1500, 1000, '¡FELICITACIONES!\nCOMPLETASTE EL MAPA',
                        { fontSize: '130px', fill: '#d49b46ff', backgroundColor: " #000000ff" }).setOrigin(0.5).setDepth(20);

                [this.ayacucho, this.junin, this.sanMartin, this.dupuy, this.pueyrredon,
                this.pedernera, this.chacabuco, this.belgrano, this.pringles].forEach(obj => {
                    obj.on('pointerover', () => { obj.setTint(0x06A788); });
                    obj.on('pointerout', () => { obj.clearTint(); });
                    console.log(`${obj.texture.key} clickeado `);

                    obj.on('pointerdown', () => {
                        if (mensajeComarca) {
                            mensajeComarca.destroy();
                            button.destroy();
                            buttonNo.destroy();
                        }
                        mensajeComarca =
                            this.add.text(1600, 200, `Deseas jugar en ${obj.texture.key} ?`,
                                {
                                    fontSize: '120px',
                                    fill: '#d49b46ff',
                                    backgroundColor: " #000000ff"
                                }).setOrigin(0.5).setDepth(20);

                        button = this.add.text(1300, 300, "SI", {

                            fontSize: '50px',
                            color: '#080808ff',
                            align: 'center',
                            fixedWidth: 260,
                            backgroundColor: '#3ed348ff'
                        }).setPadding(32).setOrigin(0.5);

                        button.setInteractive({ useHandCursor: true });

                        button.on('pointerover', () => {
                            button.setBackgroundColor('#8d8d8d');
                        });

                        button.on('pointerout', () => {
                            button.setBackgroundColor('#2d2d2d');
                        });
                        button.on('pointerdown', () => {
                            window.location.href = `/departamento/${obj.depId}`;
                        }
                        )
                        buttonNo = this.add.text(1400, 300, "NO", {

                            fontSize: '50px',
                            color: '#ffffff',
                            align: 'center',
                            fixedWidth: 260,
                            backgroundColor: '#2d2d2d'
                        }).setPadding(32).setOrigin(0.5);

                        buttonNo.setInteractive({ useHandCursor: true });

                        buttonNo.on('pointerover', () => {
                            buttonNo.setBackgroundColor('#8d8d8d');
                        });

                        buttonNo.on('pointerout', () => {
                            buttonNo.setBackgroundColor('#2d2d2d');
                        });
                        buttonNo.on('pointerdown', () => {
                            button.destroy();
                            mensajeComarca.destroy();
                            buttonNo.destroy();
                        }
                        )

                        console.log(`${obj.texture.key} clickeado`);
                        if (msj2 || msj3) { msj2.destroy(); msj3.destroy(); };
                        mensaje.destroy();

                        msj2 = this.add.text(obj.targetZone.centerX, obj.targetZone.centerY,

                            ` ${obj.texture.key}`, { fontSize: '80px', fill: '#000000ff', backgroundColor: " #baecb4ff", fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setOrigin(0.5).setDepth(20);

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
    width: 3000,
    height: 2000,

    backgroundColor: '#617f81',
 
    scene: Escena,
    

};

new Phaser.Game(config);


