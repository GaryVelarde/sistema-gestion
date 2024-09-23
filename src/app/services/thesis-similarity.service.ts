export class ThesisSimilarityService {
    // Función que calcula la distancia de Levenshtein
    private levenshteinDistance(a: string, b: string): number {
        const matrix = [];

        // Iniciar la matriz
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Calcular el costo de edición
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // Sustitución
                        matrix[i][j - 1] + 1,     // Inserción
                        matrix[i - 1][j] + 1      // Eliminación
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    // Función para calcular el porcentaje de similitud basado en la distancia de Levenshtein
    private getSimilarity(a: string, b: string): number {
        const distance = this.levenshteinDistance(a, b);
        const maxLen = Math.max(a.length, b.length);
        return ((maxLen - distance) / maxLen) * 100;  // Convertimos a porcentaje
    }

    // Función para comparar un título con los títulos del arreglo y devolver las similitudes
    public compareWithThesisTitles(inputTitle: string, thesisTitles: Array<{ title: string }>, minPercentage: number): Array<{ title: string, similarity: number }> {
        return thesisTitles
          .map(thesis => {
            const similarity = this.getSimilarity(inputTitle.toLowerCase(), thesis.title.toLowerCase());
            return { title: thesis.title, similarity: Math.round(similarity * 100) / 100 };
          })
          .filter(result => result.similarity >= minPercentage);
      }
      
}