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
        this.load.image('hoja', '/img/mapa/hoja1.png');
        this.load.image('marco', '/img/mapa/marcoL.png');
        this.load.image('sticker', '/img/mapa/sticker.png');
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
        const hoja = this.add.sprite(canvaWidth / 2, canvaHeight / 2 + 10, 'hoja').setDepth(0).setScale(0.8);
        const fondo = this.add.sprite(canvaWidth / 2, canvaHeight / 2, 'mapaSL').setScale(0.95);
        const marco = this.add.sprite(canvaWidth / 2 - 40, canvaHeight / 2 - 30, 'marco').setScale(0.9);

        fondo.setScale(0.5).setOrigin(0.5, 0.5);

        // Texto del reloj
        this.textoReloj = this.add.text(canvaWidth / 2 - 100, 30, "Tiempo: 0:00", {
            fontFamily: '"ComicSansWeb"',
            fontSize: "28px",
            fill: "#000",

        }).setDepth(50).setAlpha(0);

        // Inicializar zonas y departamentos
        const zonas = this.crearZonasObjetivo();
        this.inicializarDepartamentos(zonas);
        this.configurarEventosDrag();
    }
    crearDepartamento(config) {
        const {
            key,
            x,
            y,
            depId,
            color,
            targetZone,
            scale = 0.32
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

    crearZonasObjetivo() {
        return {
            junin: new Phaser.Geom.Rectangle(663, 116, 100, 100),
            ayacucho: new Phaser.Geom.Rectangle(547, 128, 100, 100),
            sanMartin: new Phaser.Geom.Rectangle(641, 178, 64, 64),
            dupuy: new Phaser.Geom.Rectangle(625, 473, 64, 64),
            pueyrredon: new Phaser.Geom.Rectangle(559, 317, 64, 64),
            pedernera: new Phaser.Geom.Rectangle(657, 311, 64, 64),
            chacabuco: new Phaser.Geom.Rectangle(687, 192, 64, 64),
            belgrano: new Phaser.Geom.Rectangle(550, 197, 64, 64),
            pringles: new Phaser.Geom.Rectangle(623, 233, 64, 64)
        };
    }

    inicializarDepartamentos(zonas) {
        const configDepartamentos = [
            { key: 'Ayacucho', x: 250, y: 250, depId: 2, color: 0x0E88EC, targetZone: zonas.ayacucho },
            { key: 'Junin', x: 950, y: 150, depId: 6, color: 0xFFCA7B, targetZone: zonas.junin },
            { key: 'San Martin', x: 950, y: 400, depId: 9, color: 0xA260F5, targetZone: zonas.sanMartin },
            { key: 'Dupuy', x: 250, y: 400, depId: 5, color: 0xE4F10E, targetZone: zonas.dupuy },
            { key: 'Pueyrredon', x: 1050, y: 300, depId: 8, color: 0x488D2D, targetZone: zonas.pueyrredon },
            { key: 'Pedernera', x: 1050, y: 500, depId: 7, color: 0xDF9CB8, targetZone: zonas.pedernera },
            { key: 'Chacabuco', x: 1100, y: 150, depId: 4, color: 0xCC448E, targetZone: zonas.chacabuco },
            { key: 'Belgrano', x: 300, y: 550, depId: 3, color: 0x9E8982, targetZone: zonas.belgrano },
            { key: 'Pringles', x: 300, y: 150, depId: 1, color: 0x1598DB, targetZone: zonas.pringles }
        ];

        configDepartamentos.forEach(config => {
            this.crearDepartamento(config);
        });
    }

    configurarEventosDrag() {
        this.input.on('dragstart', (pointer, gameObject) => {
            if (!this.juegoIniciado) {
                this.juegoIniciado = true;
                this.iniciarReloj();
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
        const sticker = this.add.sprite(300, 200, 'sticker').setScale(0.8);

        const mensajeFinal = this.add.text(300, 200, `¡FELICITACIONES!\n  COMPLETASTE\n     EL MAPA EN\n           ${time}\n   SEGUNDOS`, {
            fontFamily: '"ComicSansWeb"',
            fontSize: '25px',
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
            fontFamily: '"ComicSansWeb"',
            backgroundColor: "#fffffff7",
            fontSize: '15px',
            fill: '#000000ff',
        }).setOrigin(0.5).setDepth(20);
        // Crear container
        const dialogo = this.add.container(0, 0);

        const sticker2 = this.add.sprite(990, 400, 'sticker').setScale(0.75);
        dialogo.add(sticker2);

        const mensajeComarca = this.add.text(990, 380, `Deseas jugar\n       en\n ${departamento.textureKey}?`, {
            fontFamily: "ComicSansWeb",
            fontSize: '28px',
            fill: '#232323ff',
        }).setOrigin(0.5).setDepth(20);
        dialogo.add(mensajeComarca);

        const botonSi = this.crearBoton(940, 460, "SI", '#3ed348ff', () => {
            window.location.href = `/departamento/${departamento.depId}`;
        });
        dialogo.add(botonSi);

        const botonNo = this.crearBoton(985, 460, "NO", '#2d2d2d', () => {
            dialogo.destroy();
            this.dialogoActual = null;
        });
        dialogo.add(botonNo);

        // Guardar container para poder destruirlo luego
        this.dialogoActual = dialogo;
    }


    crearBoton(x, y, texto, color, callback) {
        const boton = this.add.text(x, y, texto, {
            fontFamily: '"ComicSansWeb"',
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

