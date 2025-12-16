class Escena extends Phaser.Scene {
    constructor() {
        super();
        this.departamentos = [];
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
        this.load.image('hoja', '/img/mapa/pixelHoja.png');
        this.load.image('marco', '/img/mapa/frame.png');
        this.load.image('sticker', '/img/mapa/notaPixel.png');
        this.load.image('sticker2', '/img/mapa/notaPixel2.png');
        this.load.audio('ok', './audio/ok2.wav');
        this.load.audio('final', './audio/final.mp3');
        //this.load.audio('ok', './audio/ok.mp3');
    }
    async create() {
        await document.fonts.ready;

        this.fechaInicio = new Date();
        const d = new Date();
        console.log("toString:", d.toString());
        this.tiempo = 0;
        this.juegoIniciado = false;
        this.timer = null;
        this.contador = 0;
        this.dialogoActual = null;
        this.departamentoNombre = null;

        const canvaWidth = this.sys.game.config.width;
        const canvaHeight = this.sys.game.config.height;

        // Elementos de fondo
        const hoja = this.add.sprite(canvaWidth / 2 - 60, canvaHeight / 2 - 20, 'hoja').setDepth(0).setScale(0.69);
        const fondo = this.add.sprite(canvaWidth / 2, canvaHeight / 2 + 30, 'mapaSL').setScale(0.95);
        const marco = this.add.sprite(canvaWidth / 2, canvaHeight / 2 - 1, 'marco').setScale(1);

        fondo.setScale(0.545).setOrigin(0.5, 0.5);
        //Titulo

        document.fonts.load('20px miFuente').then(() => {

            this.add.text(canvaWidth / 2 - 140, 58, "SAN LUIS MI PROVINCIA", {
                fontFamily: "miFuente",
                fontSize: "30px",
                color: "#000",
            });
            // Texto del reloj
            this.textoReloj = this.add.text(canvaWidth / 2 - 100, 30, "Tiempo: 0:00", {
                fontFamily: '"miFuente"',
                fontSize: "28px",
                fill: "#000",

            }).setDepth(50).setAlpha(0);
            this.crearCartelInicial();
            // Inicializar zonas y departamentos
            const zonas = this.crearZonasObjetivo();
            this.inicializarDepartamentos(zonas);
            this.configurarEventosDrag();


        });



    }
    crearDepartamento(config) {
        const {
            key,
            x,
            y,
            depId,
            color,
            targetZone,
            scale = 0.35
        } = config;

        const departamento = this.add.sprite(x, y, key)
            .setOrigin(0.5)
            .setScale(scale)
            .setInteractive({ draggable: true, pixelPerfect: true })
            .setDepth(10);

        // Propiedades personalizadas
        departamento.depId = depId;
        departamento.color = color;
        departamento.targetZone = targetZone;
        departamento.textureKey = key;

        // Eventos de hover
        departamento.on('pointerover', () => {
            departamento.setTintFill(color);
        });

        departamento.on('pointerout', () => {
            departamento.clearTint();
        });

        this.departamentos.push(departamento);
        return departamento;
    }
    //Cartel inicial
    crearCartelInicial() {
        const cartel = this.add.container(0, 0).setDepth(100);

        const sticker = this.add.sprite(110, 143, 'sticker2').setScale(0.6);
        cartel.add(sticker);

        const texto = this.add.text(145, 125,
            "ARRASTRÁ CADA\nDEPARTAMENTO\nHASTA SU LUGAR\nCORRECTO",
            {
                fontFamily: '"miFuente"',
                fontSize: '21px',
                fill: '#232323',
                align: 'center'
            }
        ).setOrigin(0.5);

        cartel.add(texto);

        this.cartelInicial = cartel;
        this.cartelTimerIniciado = false;
    }

    crearZonasObjetivo() {
        return {
            junin: new Phaser.Geom.Rectangle(670, 126, 100, 100),
            ayacucho: new Phaser.Geom.Rectangle(545, 139, 100, 100),
            sanMartin: new Phaser.Geom.Rectangle(646, 194, 64, 64),
            dupuy: new Phaser.Geom.Rectangle(627, 516, 64, 64),
            pueyrredon: new Phaser.Geom.Rectangle(553, 344, 64, 64),
            pedernera: new Phaser.Geom.Rectangle(661, 338, 64, 64),
            chacabuco: new Phaser.Geom.Rectangle(695, 207, 64, 64),
            belgrano: new Phaser.Geom.Rectangle(544, 213, 64, 64),
            pringles: new Phaser.Geom.Rectangle(625, 254, 64, 64)
        };
    }

    inicializarDepartamentos(zonas) {
        const configDepartamentos = [
            { key: 'Ayacucho', x: 260, y: 310, depId: 2, color: 0x0E88EC, targetZone: zonas.ayacucho },
            { key: 'Junin', x: 950, y: 150, depId: 6, color: 0xFFCA7B, targetZone: zonas.junin },
            { key: 'San Martin', x: 950, y: 400, depId: 9, color: 0xA260F5, targetZone: zonas.sanMartin },
            { key: 'Dupuy', x: 250, y: 450, depId: 5, color: 0xE4F10E, targetZone: zonas.dupuy },
            { key: 'Pueyrredon', x: 1050, y: 300, depId: 8, color: 0x488D2D, targetZone: zonas.pueyrredon },
            { key: 'Pedernera', x: 1050, y: 500, depId: 7, color: 0xDF9CB8, targetZone: zonas.pedernera },
            { key: 'Chacabuco', x: 1100, y: 150, depId: 4, color: 0xCC448E, targetZone: zonas.chacabuco },
            { key: 'Belgrano', x: 300, y: 590, depId: 3, color: 0x9E8982, targetZone: zonas.belgrano },
            { key: 'Pringles', x: 300, y: 170, depId: 1, color: 0x1598DB, targetZone: zonas.pringles }
        ];

        configDepartamentos.forEach(config => {
            this.crearDepartamento(config);
        });
    }
    //cuenta regresiva cartel inicial
    iniciarCuentaRegresivaCartel() {
        if (!this.cartelInicial || this.cartelTimerIniciado) return;

        this.cartelTimerIniciado = true;

        this.time.delayedCall(2000, () => {
            if (this.cartelInicial) {
                this.cartelInicial.destroy();
                this.cartelInicial = null;
            }
        });
    }

    configurarEventosDrag() {
        this.input.on('dragstart', (pointer, gameObject) => {
            if (!this.juegoIniciado) {
                this.juegoIniciado = true;
                this.iniciarReloj();
                this.iniciarCuentaRegresivaCartel();
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            dragX = Phaser.Math.Snap.To(dragX, 10);
            dragY = Phaser.Math.Snap.To(dragY, 10);
            gameObject.setPosition(dragX, dragY);
        });

        this.input.on('dragend', (pointer, gameObject) => {
            this.procesarDragEnd(gameObject);
        });
    }

    procesarDragEnd(gameObject) {
        const zona = gameObject.targetZone;
        const zoneCenterX = zona.centerX;
        const zoneCenterY = zona.centerY;

        const dist = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, zoneCenterX, zoneCenterY);
        const tolerancia = 80;

        if (dist < tolerancia) {
            gameObject.setPosition(zoneCenterX, zoneCenterY);
            gameObject.input.draggable = false;
            gameObject.setDepth(1);
            this.contador += 1;
            console.log(`${gameObject.textureKey} encajó en su zona`);
            console.log('contador:', this.contador);
            this.sound.play('ok', { volume: 0.5 });

            if (this.contador === 9) {

                this.finalizarJuego();
                this.sound.play('final', { volume: 0.7 });
            }
        } else {
            gameObject.setPosition(gameObject.input.dragStartX, gameObject.input.dragStartY);
        }
    }

    finalizarJuego() {
        if (this.timer) this.timer.remove();

        const fechaFin = new Date();
        const tiempoMs = fechaFin - this.fechaInicio;
        const tiempoSegundos = Math.floor(tiempoMs / 1000);

        const datos = {
            id_jugador: 1,
            fecha_inicio: this.fechaInicio.toLocaleString("sv-SE"),
            fecha_fin: fechaFin.toLocaleString("sv-SE"),
            tiempo: this.tiempo
        };

        this.guardarTiempo(datos);
        this.mostrarInterfazFinal(this.tiempo);
    }

    guardarTiempo(datos) {
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
    }

    mostrarInterfazFinal(time) {
        const sticker = this.add.sprite(290, 250, 'sticker2').setScale(0.8);
        const botonRinicio = this.crearBoton(595, 665, "REINICIAR MAPA", '#1f6c24ff', () => {
            this.scene.restart()
        });
        const mensajeFinal = this.add.text(330, 225, `¡FELICITACIONES!\n  Completaste\n     El mapa en\n           ${time}\n      segundos`, {
            fontFamily: '"miFuente"',
            fontSize: '30px',
            fill: '#232323ff'
        }).setOrigin(0.5).setDepth(20);

        // Configurar eventos de click para todos los departamentos
        this.departamentos.forEach(dep => {
            dep.on('pointerdown', () => {

                this.mostrarDialogoDepartamento(dep);
            });
        });
    }

    mostrarDialogoDepartamento(departamento) {

        // Destruir diálogo anterior
        if (this.dialogoActual) {
            this.dialogoActual.destroy();
            this.dialogoActual = null;
        }
        if (this.departamentoNombre) {
            this.departamentoNombre.destroy();
            this.departamentoNombre = null;
        }
        this.departamentoNombre = this.add.text(departamento.x + 5, departamento.y, `${departamento.textureKey}`, {
            fontFamily: '"miFuente"',
            backgroundColor: "#B9EAEA",
            fontSize: '19px',
            fill: '#000000ff',
        }).setOrigin(0.5).setDepth(20);
        // Crear container
        const dialogo = this.add.container(0, 0);

        const sticker2 = this.add.sprite(920, 400, 'sticker').setScale(0.75);
        dialogo.add(sticker2);

        const mensajeComarca = this.add.text(970, 380, `¿Deseas jugar\n       en\n ${departamento.textureKey}?`, {
            fontFamily: "miFuente",
            fontSize: '28px',
            fill: '#232323ff',
        }).setOrigin(0.5).setDepth(20);
        dialogo.add(mensajeComarca);

        const botonSi = this.crearBoton(910, 460, "SI", '#3ed348ff', () => {
            window.location.href = `/departamento/${departamento.depId}`;
        });
        dialogo.add(botonSi);

        const botonNo = this.crearBoton(955, 460, "NO", '#2d2d2d', () => {
            dialogo.destroy();
            this.dialogoActual = null;
        });
        dialogo.add(botonNo);

        // Guardar container para poder destruirlo luego
        this.dialogoActual = dialogo;
    }


    crearBoton(x, y, texto, color, callback) {
        const boton = this.add.text(x, y, texto, {
            fontFamily: '"miFuente"',
            fontSize: '15px',
            color: '#ffffff',
            align: 'center',
            fixedWidth: 100,
            backgroundColor: color
        }).setPadding(10).setOrigin(0.5);

        boton.setInteractive({ useHandCursor: true });

        boton.on('pointerover', () => {
            boton.setBackgroundColor('#8d8d8d');
        });

        boton.on('pointerout', () => {
            boton.setBackgroundColor(color);
        });

        boton.on('pointerdown', callback);

        return boton;
    }



    iniciarReloj() {
        this.tiempo = 0;

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.tiempo++;

                const minutos = Math.floor(this.tiempo / 60);
                const segundos = this.tiempo % 60;
                const segundosStr = segundos.toString().padStart(2, '0');

                this.textoReloj.setText(`Tiempo: ${minutos}:${segundosStr}`).setAlpha(1);
            },
            callbackScope: this,
            loop: true
        });
    }
}



const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'phaser-container',
    backgroundColor: "#B9EAEA",
    scene: Escena,


};

new Phaser.Game(config);

function applyCssScale() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const container = document.getElementById('phaser-container');
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Reduce el tamaño base (90% del contenedor en lugar de 100%)
    const targetWidth = Math.min(config.width, containerWidth * 0.9);
    const targetHeight = Math.min(config.height, containerHeight * 0.9);

    const scaleX = targetWidth / config.width;
    const scaleY = targetHeight / config.height;
    const scale = Math.min(scaleX, scaleY); // Reduce un 5% adicional

    // Tamaño base del canvas
    canvas.style.width = config.width + 'px';
    canvas.style.height = config.height + 'px';

    // Transformación combinada (centrado + escala)
    canvas.style.transformOrigin = 'center';
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '45%';
    canvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
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

