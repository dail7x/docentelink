

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';
import type { JsonResume } from '@/db/schema';

// Estilos del PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    color: '#2C2C2A',
  },
  header: {
    backgroundColor: '#3C3489',
    padding: 20,
    margin: -40,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    border: '3px solid #5DCAA5',
  },
  headerInfo: {
    flex: 1,
    color: 'white',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
  },
  title: {
    fontSize: 14,
    color: '#AFA9EC',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 10,
    color: '#EEEDFE',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#534AB7',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottom: '2px solid #EEEDFE',
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  institution: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#534AB7',
  },
  date: {
    fontSize: 10,
    color: '#5F5E5A',
  },
  position: {
    fontSize: 11,
    color: '#1D9E75',
    marginBottom: 2,
  },
  description: {
    fontSize: 10,
    color: '#5F5E5A',
  },
  educationItem: {
    marginBottom: 8,
  },
  educationTitle: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#534AB7',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#EEEDFE',
    color: '#534AB7',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#5F5E5A',
    borderTop: '1px solid #EEEDFE',
    paddingTop: 10,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 36,
    color: '#534AB7',
    opacity: 0.08,
  },
});

interface CvPdfTemplateProps {
  cv: JsonResume;
  username: string;
  showWatermark?: boolean;
}

export function CvPdfTemplate({ cv, username, showWatermark = true }: CvPdfTemplateProps) {
  const { basics, work, education, meta } = cv;
  const docenteMeta = meta?.docente;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark para plan free */}
        {showWatermark && (
          <Text style={styles.watermark}>DocenteLink.com</Text>
        )}

        {/* Header */}
        <View style={styles.header}>
          {basics?.image && (
            <Image src={basics.image} style={styles.headerPhoto} />
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{basics?.name || 'Sin nombre'}</Text>
            <Text style={styles.title}>
              {docenteMeta?.tituloHabilitante || basics?.label || 'Docente'}
            </Text>
            <Text style={styles.contactInfo}>
              {basics?.email && `📧 ${basics.email}`}
              {basics?.phone && `  |  📱 ${basics.phone}`}
              {docenteMeta?.provincia && `  |  📍 ${docenteMeta.provincia}`}
            </Text>
          </View>
        </View>

        {/* Resumen Profesional */}
        {basics?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen Profesional</Text>
            <Text>{basics.summary}</Text>
          </View>
        )}

        {/* Información Docente */}
        {docenteMeta && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Docente</Text>
            {docenteMeta.nivelEducativo?.length > 0 && (
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Niveles: </Text>
                {docenteMeta.nivelEducativo.join(', ')}
              </Text>
            )}
            {docenteMeta.tipoEmpleo?.length > 0 && (
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Tipo de empleo: </Text>
                {docenteMeta.tipoEmpleo.join(', ')}
              </Text>
            )}
            {docenteMeta.disponibilidad && (
              <Text>
                <Text style={{ fontWeight: 'bold' }}>Disponibilidad: </Text>
                {docenteMeta.disponibilidad === 'inmediata'
                  ? 'Inmediata'
                  : docenteMeta.disponibilidad === 'a_partir_de'
                  ? 'A partir de fecha'
                  : 'No disponible'}
              </Text>
            )}
          </View>
        )}

        {/* Experiencia */}
        {work && work.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experiencia Docente</Text>
            {work.map((job, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.institution}>{job.name}</Text>
                  <Text style={styles.date}>
                    {job.startDate} - {job.endDate || 'Actual'}
                  </Text>
                </View>
                <Text style={styles.position}>{job.position}</Text>
                {job.summary && (
                  <Text style={styles.description}>{job.summary}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Formación */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formación Académica</Text>
            {education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.educationTitle}>
                  {edu.studyType} en {edu.area}
                </Text>
                <Text style={styles.description}>
                  {edu.institution} | {edu.startDate} - {edu.endDate || 'Actual'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Materias / Habilidades */}
        {docenteMeta?.materias && docenteMeta.materias.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Materias y Especialidades</Text>
            <View style={styles.skillsContainer}>
              {docenteMeta.materias.map((materia, index) => (
                <Text key={index} style={styles.skillTag}>
                  {materia}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>
            Generado con DocenteLink — docentelink.ar/cv/{username}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
