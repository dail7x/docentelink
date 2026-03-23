export const PROVINCIAS = [
  'CABA',
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
] as const;

export type Provincia = (typeof PROVINCIAS)[number];

export const LOCALIDADES_POR_PROVINCIA: Record<Provincia, string[]> = {
  'CABA': [
    'Almagro', 'Balvanera', 'Belgrano', 'Boedo', 'Caballito', 'Chacarita',
    'Coghlan', 'Colegiales', 'Constitución', 'Flores', 'Floresta', 'La Boca',
    'La Paternal', 'Liniers', 'Mataderos', 'Monte Castro', 'Monserrat',
    'Nueva Pompeya', 'Nuñez', 'Palermo', 'Parque Avellaneda', 'Parque Chacabuco',
    'Parque Chas', 'Parque Patricios', 'Puerto Madero', 'Recoleta', 'Retiro',
    'Saavedra', 'San Cristóbal', 'San Nicolás', 'San Telmo', 'Vélez Sársfield',
    'Versalles', 'Villa Crespo', 'Villa del Parque', 'Villa Devoto',
    'Villa General Mitre', 'Villa Lugano', 'Villa Luro', 'Villa Ortúzar',
    'Villa Pueyrredón', 'Villa Real', 'Villa Riachuelo', 'Villa Santa Rita',
    'Villa Soldati', 'Villa Urquiza',
  ],
  'Buenos Aires': [
    'San Isidro', 'Vicente López', 'Olivos', 'Tigre', 'Pilar', 'Avellaneda',
    'Lanús', 'Lomas de Zamora', 'Quilmes', 'La Plata', 'Ramos Mejía', 'Morón',
    'San Miguel', 'Ituzaingó', 'Castelar', 'Bahía Blanca', 'Mar del Plata',
    'Tandil', 'Escobar', 'Moreno', 'Merlo', 'José C. Paz', 'Malvinas Argentinas',
  ],
  'Catamarca': [
    'San Fernando del Valle', 'Valle Viejo', 'Fray Mamerto Esquiú',
    'Belén', 'Andalgalá', 'Santa María', 'Tinogasta',
  ],
  'Córdoba': [
    'Córdoba Capital', 'Villa Carlos Paz', 'Alta Gracia', 'Río Cuarto',
    'Villa María', 'Jesús María', 'San Francisco', 'Bell Ville', 'La Falda',
  ],
  'Santa Fe': [
    'Rosario', 'Santa Fe Capital', 'Rafaela', 'Venado Tuerto', 'Santo Tomé',
    'Reconquista', 'Villa Constitución', 'Esperanza',
  ],
  'Mendoza': [
    'Mendoza Capital', 'Godoy Cruz', 'Guaymallén', 'Maipú', 'Luján de Cuyo',
    'San Rafael', 'Tunuyán', 'San Martín',
  ],
  'Tucumán': [
    'San Miguel de Tucumán', 'Yerba Buena', 'Tafí Viejo', 'Concepción',
    'Aguilares', 'Famaillá', 'Lules',
  ],
  'Salta': [
    'Salta Capital', 'San Ramón de la Nueva Orán', 'Tartagal', 'General Güemes',
    'Rosario de la Frontera', 'Metán',
  ],
  'Chaco': [
    'Resistencia', 'Presidencia Roque Sáenz Peña', 'Villa Ángela', 'Barranqueras',
    'Fontana',
  ],
  'Entre Ríos': [
    'Paraná', 'Concordia', 'Gualeguaychú', 'Concepción del Uruguay',
    'Villaguay', 'Chajarí',
  ],
  'Jujuy': [
    'San Salvador de Jujuy', 'San Pedro', 'Palpalá',
    'Libertador General San Martín', 'Perico',
  ],
  'Corrientes': [
    'Corrientes Capital', 'Goya', 'Paso de los Libres', 'Curuzú Cuatiá',
    'Mercedes',
  ],
  'Misiones': [
    'Posadas', 'Eldorado', 'Oberá', 'Puerto Iguazú', 'Apóstoles',
  ],
  'San Juan': [
    'San Juan Capital', 'Rawson', 'Rivadavia', 'Chimbas', 'Santa Lucía',
  ],
  'San Luis': ['San Luis Capital', 'Villa Mercedes', 'Merlo'],
  'Neuquén': [
    'Neuquén Capital', 'Cutral Có', 'Centenario', 'Plottier', 'Zapala',
  ],
  'Río Negro': ['Viedma', 'Bariloche', 'General Roca', 'Cipolletti'],
  'Chubut': [
    'Rawson', 'Trelew', 'Comodoro Rivadavia', 'Puerto Madryn', 'Esquel',
  ],
  'Santa Cruz': ['Río Gallegos', 'Caleta Olivia', 'El Calafate'],
  'Tierra del Fuego': ['Ushuaia', 'Río Grande', 'Tolhuin'],
  'La Pampa': ['Santa Rosa', 'General Pico'],
  'La Rioja': ['La Rioja Capital', 'Chilecito'],
  'Formosa': ['Formosa Capital', 'Clorinda'],
  'Santiago del Estero': [
    'Santiago del Estero Capital', 'La Banda',
    'Termas de Río Hondo',
  ],
} as const;

export type Localidad = string;

export const getLocalidades = (provincia: Provincia): Localidad[] => {
  return LOCALIDADES_POR_PROVINCIA[provincia] || [];
};
