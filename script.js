// USUARIO ACTUAL : activeUser
// 
function loadUsers(){
    const ul = document.getElementById('users');
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((resp) => resp.json())
    .then(function(data) {
        let authors = data
        console.log(authors)
        var getlocalUser = localStorage.getItem("activeUser");
        if(getlocalUser != null && getlocalUser != "" && getlocalUser != false && getlocalUser != undefined){
            document.getElementById("userActivo").textContent = getlocalUser;
        } else {
            document.getElementById("userActivo").textContent = authors[0].name;
        }
        return authors.map(function(author) {
            let li = createNode('li');
            li.onclick = function(e) {
                let name = author.name;
                window.localStorage.setItem('activeUser', name);
                document.getElementById("userActivo").textContent = localStorage.getItem("activeUser");
                console.log("Usuario activo: " + window.localStorage.getItem('activeUser'));
                document.getElementById('posts').innerHTML = "";
                cargarPosts();
            }
            let img = createNode('img');
            append(li, img);
            let contenido = createNode('div');
            append(li, contenido);
            let nombre = createNode('p');
            nombre.className = "nombreUser";
            let email = createNode('p');
            email.className = "emailUser";
            let separador = createNode('hr');
            img.src = 'perfil.png';
            img.alt = 'FotoUsuario';
            nombre.innerHTML = `${author.name}`;
            email.innerHTML = `${author.email}`;
            append(li, img);
            append(contenido, nombre);
            append(contenido, email);
            append(li, contenido)
            append(ul, li);
            append(ul, separador);
        })
    })
    .catch(function(error) {
        console.log(error);
    });
}
function createNode(element) {
    return document.createElement(element);
}
function append(parent, el) {
    return parent.appendChild(el);
}
function uploadImage(){
    const section = document.getElementById('posts');
    var fotos = localStorage.getItem("fotos");
    if(fotos != null && fotos != "" && fotos != false && fotos != undefined){ // Si existe el array de fotos
        console.log("YA EXISTE EL ARRAY");
        // console.log(typeof(window.localStorage.getItem('fotos')));
        let arrayFotos = JSON.parse(window.localStorage.getItem('fotos'));//window.localStorage.getItem("fotos");
        console.log(arrayFotos);
        const publication = {
            id: arrayFotos.length,
            nameUser: document.getElementById("userActivo").innerHTML,
            foto: document.getElementsByTagName('img')[1].src,
            descripcion: document.getElementById("descripcion").value,
            megustas : [],
            comentarios : []
        }
        var postNuevo = crearPost(publication.id);
        console.log("PAPAAAA" + postNuevo.getElementsByTagName('img')[0].src);
        console.log(publication);
        arrayFotos.push(publication);
        window.localStorage.setItem('fotos', JSON.stringify(arrayFotos));
        // append(post, foto);
        section.insertBefore(postNuevo, section.firstChild);
        // append(section, post);
    } else { // Si no existe el array de fotos
        console.log("NOOO EXISTE EL ARRAY");
        let arrayFotos = [];
        const publication = {
            id: arrayFotos.length,
            nameUser: document.getElementById("userActivo").innerHTML,
            foto: document.getElementsByTagName('img')[1].src,
            descripcion: document.getElementById("descripcion").value,
            megustas : [],
            comentarios : []
        }
        var postNuevo = crearPost(publication.id);

        append(section, postNuevo);
        arrayFotos.push(publication);
        window.localStorage.setItem('fotos', JSON.stringify(arrayFotos));
    }
}

function cargarImagen(){
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        var img = document.getElementById("imagenASubir");
        img.src = reader.result;
    }
    if (file) {
        reader.readAsDataURL(file);
    } else {
        img.src = "noImagen.jpg";
    }
}

function cargarPosts(){
    // localStorage.removeItem("fotos");
    const section = document.getElementById('posts');
    var fotos = localStorage.getItem("fotos");
    if(fotos != null && fotos != "" && fotos != false && fotos != undefined){
        console.log("Cargando posts");
        let arrayFotos = JSON.parse(window.localStorage.getItem('fotos'));
        arrayFotos.reverse();
        console.log(arrayFotos);
        arrayFotos.forEach(function(element) {
            console.log(element.megustas);
            // ##############################################################################################
            let post = createNode('article');
            post.className = 'publicacion';
            
            let header = createNode('div');
            header.className = 'header';
            let imgHeader = createNode('img');
            imgHeader.className = 'imgHeader';
            imgHeader.src = 'perfil.png';
            imgHeader.alt = 'FotoUsuario';

            let nombre = createNode('h1');
            nombre.textContent = element.nameUser;

            append(header, imgHeader);
            append(header, nombre);

            let footer = createNode('section');
            footer.className = 'footer';
            let idPublicacion = createNode('input');
            idPublicacion.type = 'hidden';
            idPublicacion.value = element.id;
            append(footer, idPublicacion);
            
            let fav = createNode('article');
            let comment = createNode('article');
            comment.className = 'comment';
            comment.id = 'comment';
            if(element.megustas.includes(localStorage.getItem("activeUser"))){
                // console.log("Ya me gusta");
                fav.className = 'heart_animate';
            } else {
                // console.log("No me gusta");
                fav.className = 'fav';
            }
            
            fav.id = 'fav';
            fav.onclick = function(){
                let idPublicacion = this.parentNode.getElementsByTagName('input')[0].value;
                console.log(idPublicacion);
                if(fav.className == 'fav'){ // Si no esta marcado (NO ME GUSTA)
                    console.log("CLICK EN FAV");
                    fav.className = 'heart_animate';
                    let nuevoArray = darLike(idPublicacion);
                    window.localStorage.setItem('fotos', JSON.stringify(nuevoArray));
                    // console.log(JSON.parse(window.localStorage.getItem('fotos')));
                } else { // Si esta marcado (ME GUSTA)
                    console.log("CLICK EN NO ME GUSTA");
                    fav.className = 'fav';
                    let nuevoArray = quitarLike(idPublicacion);
                    window.localStorage.setItem('fotos', JSON.stringify(nuevoArray));
                }
            }
            let imgcomment = createNode('img');
            imgcomment.className = 'imgcomment';

            comment.onclick = function(){
                this.parentNode.getElementsByTagName('input')[1].focus();
            }
            append(footer, fav);
            append(footer, comment);
            
            let listFavs = createNode('ul');
            listFavs.className = 'listFavs';
            
            let iniciador = createNode('li');
            iniciador.textContent = "A ";
            append(listFavs, iniciador);
            if(element.megustas.length == 0){
                console.log("No hay megustas");
                let li = createNode('li');
                li.className = 'nadie';
                li.textContent = "nadie";
                append(listFavs, li);
                let li2 = createNode('li');
                li2.className = 'liFavUltimo';
                li2.textContent = "le gusta esto";
                append(listFavs, li2);
            } else if(element.megustas.length == 1){
                let li = createNode('li');
                li.className = 'liFavAnteUltimo';
                li.textContent = element.megustas[0] + " ";
                append(listFavs, li);
                let li2 = createNode('li');
                li2.className = 'liFavUltimo';
                li2.textContent = "le gusta esto";
                append(listFavs, li2);

            } else{
                for(let i = 0; i < element.megustas.length; i++){
                    let li = createNode('li');
                    li.className = 'liFav';
                    
                    // let li = createNode('li');
                    if(i+1 == element.megustas.length){
                        li.className = 'liFavAnteUltimo';
                        li.textContent = element.megustas[i] + " ";
                    } else {
                        li.textContent = element.megustas[i];
                    }
                    append(listFavs, li);
                }
                let li = createNode('li');
                li.className = 'liFavUltimo';
                li.textContent = "les gusta esto";
                append(listFavs, li);
            }
            append(footer, listFavs);
            
            let descripcion = createNode('article');
            descripcion.className = 'descripcion';
            let descripcionText = createNode('p');
            if(element.descripcion != ""){
                // descripcionText.textContent = element.nameUser + " " + element.descripcion;
                descripcionText.textContent = element.nameUser;
                descripcionText.className = 'autor';
                let descripcionText2 = createNode('p');
                descripcionText2.textContent = " " + element.descripcion;
                append(descripcion, descripcionText);
                append(descripcion, descripcionText2);
                append(footer, descripcion);
            }
            
            
            let comentarios2 = createNode('article');
            comentarios2.className = 'comentarios';
            let listComentarios = createNode('ul');
            listComentarios.id = 'listComentarios';
            listComentarios.className = 'listComentarios';
            if(element.comentarios.length > 0){
                for(let i = 0; i < element.comentarios.length; i++){
                    let li = createNode('li');
                    li.className = 'liComentario';

                    let comentarioAutor = createNode('p');
                    comentarioAutor.className = 'comentarioAutor';
                    comentarioAutor.textContent = element.comentarios[i].autor;
                    let comentarioText = createNode('p');
                    comentarioText.className = 'comentarioText';
                    comentarioText.textContent = element.comentarios[i].contenido;

                    // li.textContent = element.comentarios[i];
                    append(li, comentarioAutor);
                    append(li, comentarioText);
                    append(listComentarios, li);
                }
                append(comentarios2, listComentarios);
                append(footer, comentarios2);
            }
            let crearComentario = createNode('input');
            crearComentario.type = 'text';
            crearComentario.name = 'crearComentario';
            crearComentario.className = 'crearComentario';
            crearComentario.placeholder = 'Escribe un comentario...';
            crearComentario.onkeypress = function(e){
                if(e.key == 'Enter'){
                    if(this.value != "" && this.value.trim() != ""){
                        console.log("Apreto enter");
                        let comentario = this.value;
                        console.log(comentario);
                        let idPost = this.parentNode.getElementsByTagName('input')[0].value;
                        console.log(this.parentNode.getElementsByTagName('input')[0].value);
                        let nuevoArray = agregarComentario(idPost, comentario, localStorage.getItem("activeUser"));
                        window.localStorage.setItem('fotos', JSON.stringify(nuevoArray));
                        let prevSibling = this.previousElementSibling;
                        let listaComentarios = prevSibling.firstChild;
                        console.log(prevSibling.firstChild.className);
                        let li = createNode('li');
                        li.className = 'liComentario';
                        let comentarioAutor = createNode('p');
                        comentarioAutor.className = 'comentarioAutor';
                        comentarioAutor.textContent = localStorage.getItem("activeUser");
                        let comentarioText = createNode('p');
                        comentarioText.className = 'comentarioText';
                        comentarioText.textContent = this.value;
                        append(li, comentarioAutor);
                        append(li, comentarioText);
                        append(listaComentarios, li);
                        this.value = '';
                    }
                }
            }
            append(footer, crearComentario);

            let foto = createNode('img');
            foto.alt = 'FotoPost';
            foto.className = 'fotoPost';
            foto.src = element.foto;
                        

            append(post, header);
            append(post, foto);
            append(post, footer);
            append(section, post);
        });
        console.log("Posts cargados");
        console.log(JSON.parse(window.localStorage.getItem('fotos')));
    }
}

function crearPost(id){
    let post = createNode('article');
    post.className = 'publicacion';

    let header = createNode('div');
    header.className = 'header';
    let imgHeader = createNode('img');
    imgHeader.className = 'imgHeader';
    imgHeader.src = 'perfil.png';
    imgHeader.alt = 'FotoUsuario';
    
    append(header, imgHeader);

    let nombre = createNode('h1');
    nombre.innerHTML = document.getElementById("userActivo").innerHTML;
    
    append(header, nombre);

    let foto = createNode('img');
    foto.className = 'fotoPost';
    foto.alt = 'FotoPost';
    foto.src = document.getElementById("imagenASubir").src;
    
    let footer = createNode('section');
    footer.className = 'footer';

    let idPublicacion = createNode('input');
    idPublicacion.type = 'hidden';
    idPublicacion.value = id;
    append(footer, idPublicacion);
    
    let fav = createNode('article');
    fav.className = 'fav';
    fav.id = 'fav';
    fav.onclick = function(){
        let idPublicacion = this.parentNode.getElementsByTagName('input')[0].value;
        console.log(idPublicacion);
        if(fav.className == 'fav'){ // Si no esta marcado (NO ME GUSTA)
            console.log("CLICK EN FAV");
            fav.className = 'heart_animate';
            let nuevoArray = darLike(idPublicacion);
            window.localStorage.setItem('fotos', JSON.stringify(nuevoArray));
        } else { // Si esta marcado (ME GUSTA)
            console.log("CLICK EN NO ME GUSTA");
            fav.className = 'fav';
            let nuevoArray = quitarLike(idPublicacion);
            window.localStorage.setItem('fotos', JSON.stringify(nuevoArray));
        }
    }
    let comment = createNode('article');
    comment.className = 'comment';
    comment.id = 'comment';

    comment.onclick = function(){
        this.parentNode.getElementsByTagName('input')[1].focus();
    }
    append(footer, fav);
    append(footer, comment);
    
    let listFavs = createNode('ul');
    listFavs.className = 'listFavs';
    let iniciador = createNode('li');
    append(listFavs, iniciador);
    iniciador.textContent = "A ";
    let li = createNode('li');
    li.className = 'nadie';
    li.textContent = "nadie";
    append(listFavs, li);
    let li2 = createNode('li');
    li2.className = 'liFavUltimo';
    li2.textContent = "le gusta esto";
    append(listFavs, li2);
    append(footer, listFavs);
    
    if(document.getElementById("descripcion").value != ""){
        let descripcion = createNode('article');
        descripcion.className = 'descripcion';
        let descripcionText = createNode('p');
        descripcionText.textContent = document.getElementById("userActivo").innerHTML;
        descripcionText.className = 'autor';
        let descripcionText2 = createNode('p');
        descripcionText2.textContent = " " + document.getElementById("descripcion").value;
        append(descripcion, descripcionText);
        append(descripcion, descripcionText2);
        append(footer, descripcion);
    }

    
    let comentarios = createNode('article');
    comentarios.className = 'comentarios';
    let listComentarios = createNode('ul');
    listComentarios.className = 'listComentarios';
    
    append(comentarios, listComentarios);
    append(footer, comentarios);
    
    let crearComentario = createNode('input');
    crearComentario.type = 'text';
    crearComentario.name = 'crearComentario';
    crearComentario.className = 'crearComentario';
    crearComentario.placeholder = 'Escribe un comentario...';
    crearComentario.onkeypress = function(e){
        if(e.key == 'Enter'){
            if(this.value != "" && this.value.trim() != ""){
                console.log("Apreto enter");
                let comentario = this.value;
                console.log(comentario);
                let idPost = this.parentNode.getElementsByTagName('input')[0].value;
                console.log(this.parentNode.getElementsByTagName('input')[0].value);
                let nuevoArray = agregarComentario(idPost, comentario, localStorage.getItem("activeUser"));
                window.localStorage.setItem('fotos', JSON.stringify(nuevoArray));
                let prevSibling = this.previousElementSibling;
                let listaComentarios = prevSibling.firstChild;
                console.log(prevSibling.firstChild.className);
                let li = createNode('li');
                li.className = 'liComentario';
                let comentarioAutor = createNode('p');
                comentarioAutor.className = 'comentarioAutor';
                comentarioAutor.textContent = localStorage.getItem("activeUser");
                let comentarioText = createNode('p');
                comentarioText.className = 'comentarioText';
                comentarioText.textContent = this.value;
                append(li, comentarioAutor);
                append(li, comentarioText);
                append(listaComentarios, li);
                this.value = '';
            }
        }
    }
    append(footer, crearComentario);

    append(post, header);
    append(post, foto);
    append(post, footer);
    return post;
}

function agregarComentario(idPublicacion, comentario, autor){
    let arrayFotos = JSON.parse(window.localStorage.getItem('fotos'));
    arrayFotos.forEach(function(element) {
        if(element.id == idPublicacion){
            const comentarioObject = {
                autor: autor,
                contenido: comentario
            }
            element.comentarios.push(comentarioObject);
            // element.comentarios.push(comentario);
        }
    }
    );
    return arrayFotos;
}

function darLike(entidad){
    let arrayFotos = JSON.parse(window.localStorage.getItem('fotos'));
    console.log(arrayFotos);
    let nuevoArray = [];
    arrayFotos.forEach(function(element) {

        if(element.id == entidad){ // Si encontramos el elemento
            console.log("Encontrado");
            element.megustas.push(document.getElementById("userActivo").innerHTML);
        }
        nuevoArray.push(element);
    }
    );
    // window.localStorage.setItem('fotos', JSON.stringify(nuevoArray));
    console.log("Array despues de ME GUSTA: ");
    // console.log(JSON.parse(window.localStorage.getItem('fotos')));
    return nuevoArray;
}
function quitarLike(entidad){
    let arrayFotos = JSON.parse(window.localStorage.getItem('fotos'));
    console.log(arrayFotos);
    // arrayFotos.reverse();
    // console.log(entidad.id);
    // if (arrayFotos.includes(entidad) == true){
    //     console.log("Si esta");
    // }
    let nuevoArray = [];
    arrayFotos.forEach(function(element) {
        // nuevoArray.push(element);
        if(element.id == entidad){ // Si encontramos el elemento
            console.log("Encontrado");
            let allMeGustas = element.megustas;
            let index = allMeGustas.indexOf(document.getElementById("userActivo").innerHTML);
            element.megustas.splice(index, 1);
            // break;
            // element.megustas.pop();
            // element.megustas = document.getElementById("userActivo").innerHTML;
        }
        nuevoArray.push(element);
        // if(element.foto == document.getElementById("imagenASubir").src){
        //     element.megustas.push(document.getElementById("userActivo").innerHTML);
        // }
    }
    );
    // window.localStorage.setItem('fotos', JSON.stringify(nuevoArray));
    // console.log(JSON.parse(window.localStorage.getItem('fotos')));
    return nuevoArray;
}