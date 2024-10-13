CREATE DATABASE oliver_store;
USE oliver_store;

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'usuario') DEFAULT 'usuario'
);

-- Tabla de Skins
CREATE TABLE skins (
    id_skin INT AUTO_INCREMENT PRIMARY KEY,
    nombre_skin VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    imagen_url VARCHAR(255) NOT NULL
);

-- Tabla de Ventas
CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_skin INT NOT NULL,
    fecha_venta DATETIME NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_skin) REFERENCES skins(id_skin)
);

-- Tabla de Mensajes (Contacto)
CREATE TABLE mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL
);
