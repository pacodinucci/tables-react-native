import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { PlusCircle, Settings } from "lucide-react-native";

// Función inicial para generar letras de las columnas
const generateInitialColumnHeaders = (numColumns) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const headers = [];
  for (let i = 0; i < numColumns; i++) {
    headers.push(alphabet[i % alphabet.length]);
  }
  return headers;
};

export default function TableDetail({ route }) {
  const { tableId } = route.params;

  // Inicializar con 2 columnas y 3 filas
  const initialRows = [
    ["", ""],
    ["", ""],
    ["", ""],
  ];
  const initialColumnHeaders = generateInitialColumnHeaders(2); // 2 columnas (A, B)
  const initialRowHeaders = [1, 2, 3]; // 3 filas (1, 2, 3)

  const [rows, setRows] = useState(initialRows); // Inicializamos con 3 filas y 2 columnas
  const [columnHeaders, setColumnHeaders] = useState(initialColumnHeaders); // Inicializamos con 2 columnas
  const [rowHeaders, setRowHeaders] = useState(initialRowHeaders); // Inicializamos con 3 filas
  const [selectedCells, setSelectedCells] = useState([{ row: 0, col: 0 }]); // Seleccionar A1 inicialmente
  const [selectedContent, setSelectedContent] = useState(initialRows[0][0]); // Contenido de la celda A1
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 }); // Coordenadas de la celda seleccionada

  // Referencia para los inputs
  const inputRefs = useRef([]); // Array de referencias para todos los inputs

  // Función para actualizar una celda en la tabla
  const updateCell = (text, rowIndex, colIndex) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = text;
    setRows(newRows);

    // Actualizar el contenido del input superior si es la celda seleccionada
    if (selectedCell?.row === rowIndex && selectedCell?.col === colIndex) {
      setSelectedContent(text);
    }
  };

  // Función para actualizar el encabezado de una columna
  const updateColumnHeader = (text, colIndex) => {
    const newHeaders = [...columnHeaders];
    newHeaders[colIndex] = text;
    setColumnHeaders(newHeaders);
  };

  // Función para actualizar el encabezado de una fila
  const updateRowHeader = (text, rowIndex) => {
    const newHeaders = [...rowHeaders];
    newHeaders[rowIndex] = text;
    setRowHeaders(newHeaders);
  };

  // Función para actualizar el contenido del input superior
  const handleContentChange = (text) => {
    setSelectedContent(text);
    if (selectedCell) {
      updateCell(text, selectedCell.row, selectedCell.col);
    }
  };

  // Función para agregar una nueva fila
  const addRow = () => {
    const newRow = Array(columnHeaders.length).fill(""); // Nueva fila con la misma cantidad de columnas
    setRows([...rows, newRow]);
    setRowHeaders([...rowHeaders, rowHeaders.length + 1]); // Agregar nuevo número de fila
  };

  // Función para agregar una nueva columna
  const addColumn = () => {
    const newRows = rows.map((row) => [...row, ""]); // Agregar una columna vacía a cada fila existente
    setRows(newRows);
    setColumnHeaders([
      ...columnHeaders,
      generateInitialColumnHeaders(columnHeaders.length + 1)[
        columnHeaders.length
      ],
    ]); // Agregar la siguiente letra del abecedario
  };

  // Función para seleccionar una celda y actualizar el input de contenido
  const handleCellPressIn = (rowIndex, colIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    setSelectedContent(rows[rowIndex][colIndex]);
    setSelectedCells([{ row: rowIndex, col: colIndex }]); // Selecciona la celda inicial
    inputRefs.current[`${rowIndex}-${colIndex}`]?.focus(); // Enfocar el input al tocar la celda
  };

  return (
    <TouchableWithoutFeedback onPress={() => setSelectedCells([])}>
      <View style={{ flex: 1 }}>
        {/* Sección fija de botones y input */}
        <View style={styles.fixedSection}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={addRow} style={styles.iconButton}>
              <PlusCircle size={24} color={"darkgray"} />
              <Text style={styles.iconText}>Fila</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addColumn} style={styles.iconButton}>
              <PlusCircle size={24} color={"darkgray"} />
              <Text style={styles.iconText}>Columna</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.selectedContentInput}
              value={selectedContent}
              onChangeText={handleContentChange}
              editable={!!selectedCell}
            />
            <TouchableOpacity style={styles.formatButton}>
              <Settings size={24} color={"darkgray"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenedor de la tabla con scroll horizontal y vertical */}
        <ScrollView horizontal>
          <View>
            {/* Encabezados de columnas */}
            <View style={{ flexDirection: "row" }}>
              <View style={styles.cornerCell}>
                <Text></Text>
              </View>
              {columnHeaders.map((header, colIndex) => (
                <View key={colIndex} style={styles.headerCell}>
                  <TextInput
                    value={header}
                    onChangeText={(text) => updateColumnHeader(text, colIndex)}
                    style={{ textAlign: "center" }}
                  />
                </View>
              ))}
            </View>

            {/* Encabezados de filas y contenido de la tabla */}
            <View style={{ flexDirection: "row" }}>
              <ScrollView style={styles.verticalScrollContainer}>
                {rows.map((row, rowIndex) => (
                  <View key={rowIndex} style={{ flexDirection: "row" }}>
                    <View style={styles.rowHeaderCell}>
                      <TextInput
                        value={rowHeaders[rowIndex].toString()}
                        onChangeText={(text) => updateRowHeader(text, rowIndex)}
                        style={{ textAlign: "center" }}
                      />
                    </View>
                    {row.map((cell, colIndex) => (
                      <TouchableOpacity
                        key={colIndex}
                        onPressIn={() => handleCellPressIn(rowIndex, colIndex)}
                      >
                        <View
                          style={[
                            styles.cell,
                            selectedCells.some(
                              (selected) =>
                                selected.row === rowIndex &&
                                selected.col === colIndex
                            ) && styles.selectedCellBorder,
                          ]}
                        >
                          <TextInput
                            ref={(el) =>
                              (inputRefs.current[`${rowIndex}-${colIndex}`] =
                                el)
                            }
                            value={cell}
                            onChangeText={(text) =>
                              updateCell(text, rowIndex, colIndex)
                            }
                            style={{ padding: 5, textAlign: "center" }}
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Estilos
const styles = StyleSheet.create({
  fixedSection: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginRight: 5,
  },
  iconText: {
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedContentInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 8,
    flex: 1,
    marginRight: 4,
  },
  formatButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  tableContainer: {
    flex: 1,
  },
  cell: {
    width: 100,
    height: 50,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCell: {
    width: 100,
    height: 40,
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  rowHeaderCell: {
    width: 80,
    height: 50,
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  cornerCell: {
    width: 80,
    height: 40,
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCellBorder: {
    borderColor: "#B5D2B3",
    borderWidth: 2,
  },
  verticalScrollContainer: {
    flex: 1,
  },
});
