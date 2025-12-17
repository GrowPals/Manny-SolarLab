# Cómo Crear Nuevos Diagnósticos Solares

## Método Rápido: Copiar y Editar JSON

### Paso 1: Copiar la plantilla
Copia el archivo `public/data/plantilla.json` con un nuevo nombre:
```
public/data/nombre-cliente.json
```

El nombre del archivo será el ID usado en la URL. Usa minúsculas y guiones.

### Paso 2: Editar los datos del cliente
Abre el archivo JSON y modifica:

```json
{
  "client": {
    "name": "NOMBRE COMPLETO DEL CLIENTE (como aparece en CFE)",
    "shortName": "Nombre Corto",
    "address": "Dirección completa",
    "colony": "Colonia",
    "city": "Ciudad, Estado",
    "postalCode": "00000",
    "serviceNumber": "000000000000",
    "accountNumber": "00XX00X000000000",
    "tariff": "PDBT",
    "tariffName": "Pequeña Demanda Baja Tensión",
    "meterNumber": "XXXXXX",
    "currentPeriod": "01 Ene - 01 Feb 2025",
    "dueDate": "15 Feb 2025",
    "cutoffDate": "16 Feb 2025"
  }
}
```

### Paso 3: Agregar el historial de consumo
El consumo se obtiene del recibo de CFE. El primer registro debe tener `"current": true`:

```json
{
  "consumption": [
    { "period": "Feb 25", "month": "Feb", "year": 2025, "kwh": 1000, "amount": 5000, "days": 30, "season": "cold", "current": true },
    { "period": "Ene 25", "month": "Ene", "year": 2025, "kwh": 900, "amount": 4500, "days": 31, "season": "cold" },
    ...más periodos
  ]
}
```

**Temporadas (season):**
- `"cold"` - Nov, Dic, Ene, Feb (invierno)
- `"mild"` - Mar, Abr, Oct (templado)
- `"hot"` - May, Jun, Jul, Ago, Sep (verano/calor)

### Paso 4: Configurar el sistema recomendado
Ajusta el tamaño del sistema según el consumo:

```json
{
  "systemDefaults": {
    "systemSize": 5.0,    // kWp - ajustar según consumo
    "inflationRate": 5    // % de inflación proyectada
  }
}
```

**Guía para tamaño del sistema:**
| Consumo Mensual | Sistema Recomendado |
|-----------------|---------------------|
| ~500 kWh        | 3-4 kWp            |
| ~1000 kWh       | 5-6 kWp            |
| ~2000 kWh       | 10-12 kWp          |
| ~4000 kWh       | 17-20 kWp          |

### Paso 5: Generar el link
El link será:
```
https://tu-dominio.com/?id=nombre-cliente
```

Por ejemplo, si el archivo es `public/data/maria-garcia.json`:
```
https://tu-dominio.com/?id=maria-garcia
```

## Desplegar Cambios

Después de agregar un nuevo JSON:

1. **Local:** Solo guarda el archivo y recarga la página
2. **Producción:** Haz deploy a Vercel:
   ```bash
   git add .
   git commit -m "Nuevo diagnóstico: nombre-cliente"
   git push
   ```

## Ejemplo Completo

Archivo: `public/data/juan-perez.json`
```json
{
  "client": {
    "name": "PEREZ LOPEZ JUAN CARLOS",
    "shortName": "Juan Pérez",
    "address": "Av. Reforma 123",
    "colony": "Centro",
    "city": "CDMX",
    "postalCode": "06600",
    "serviceNumber": "123456789012",
    "accountNumber": "12AB34C567890123",
    "tariff": "PDBT",
    "tariffName": "Pequeña Demanda Baja Tensión",
    "meterNumber": "ABC123",
    "currentPeriod": "01 Nov - 01 Dic 2025",
    "dueDate": "15 Dic 2025",
    "cutoffDate": "16 Dic 2025"
  },
  "consumption": [
    { "period": "Dic 25", "month": "Dic", "year": 2025, "kwh": 850, "amount": 4500, "days": 30, "season": "cold", "current": true },
    { "period": "Nov 25", "month": "Nov", "year": 2025, "kwh": 780, "amount": 4100, "days": 31, "season": "mild" },
    { "period": "Oct 25", "month": "Oct", "year": 2025, "kwh": 920, "amount": 4800, "days": 30, "season": "mild" },
    { "period": "Sep 25", "month": "Sep", "year": 2025, "kwh": 1100, "amount": 5800, "days": 30, "season": "hot" },
    { "period": "Ago 25", "month": "Ago", "year": 2025, "kwh": 1250, "amount": 6600, "days": 31, "season": "hot" },
    { "period": "Jul 25", "month": "Jul", "year": 2025, "kwh": 1180, "amount": 6200, "days": 31, "season": "hot" },
    { "period": "Jun 25", "month": "Jun", "year": 2025, "kwh": 1050, "amount": 5500, "days": 30, "season": "hot" },
    { "period": "May 25", "month": "May", "year": 2025, "kwh": 900, "amount": 4700, "days": 31, "season": "hot" },
    { "period": "Abr 25", "month": "Abr", "year": 2025, "kwh": 800, "amount": 4200, "days": 30, "season": "mild" }
  ],
  "billBreakdown": {
    "subtotalEnergy": 3600,
    "iva": 576,
    "dap": 324,
    "total": 4500
  },
  "systemDefaults": {
    "systemSize": 5.5,
    "inflationRate": 5
  }
}
```

Link: `https://tu-dominio.com/?id=juan-perez`

---

## URLs Actuales Disponibles

| Cliente | URL |
|---------|-----|
| Adolfo Reza | `/?id=adolfo-reza` |
| (Plantilla) | `/?id=plantilla` |

---

**Nota:** Si no se proporciona `?id=` en la URL, se mostrarán los datos por defecto (Adolfo Reza).
