# Invitación digital · Bautizo de Joaquín

Invitación tipo libro: aparece cerrada y se abre con el botón **Abrir invitación** (o tocando la portada).
En pantallas anchas se abre hacia la izquierda; en celulares se abre hacia arriba para que el texto se lea bien.
Al abrir suena una caja musical (Canción de cuna de Brahms) que se puede pausar.

## Estructura

```
index.html          Contenido de la invitación
css/styles.css      Diseño
js/main.js          Apertura, música, pétalos e ilustraciones generadas
assets/img/         Foto de Joaquín
referencias/        Diseños originales y la versión anterior (no se publican en la página)
```

## Verla en local

Abrir `index.html` con doble clic, o levantar un servidor:

```bash
npx http-server . -p 5620 -c-1
```

## Publicación

Publicada con GitHub Pages desde la rama `main`: https://bangirasryder.github.io/bautizo-joaquin/

Cada `git push` a `main` actualiza la página en uno o dos minutos.
La carpeta `referencias/` no se sube al repositorio (está en `.gitignore`).
