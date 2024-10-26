import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  PanResponder,
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
  const [selectionStart, setSelectionStart] = useState(null); // Punto inicial de la selección
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

  // Función para seleccionar toda una columna
  const handleColumnLongPress = (colIndex) => {
    const newSelectedCells = rows.map((_, rowIndex) => ({
      row: rowIndex,
      col: colIndex,
    }));
    setSelectedCells(newSelectedCells);
  };

  // Función para seleccionar toda una fila
  const handleRowLongPress = (rowIndex) => {
    const newSelectedCells = columnHeaders.map((_, colIndex) => ({
      row: rowIndex,
      col: colIndex,
    }));
    setSelectedCells(newSelectedCells);
  };

  // PanResponder para detectar movimiento y selección de celdas
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        const cell = getCellFromLocation(locationX, locationY);
        if (cell) {
          handleCellPressIn(cell.row, cell.col);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        const cell = getCellFromLocation(locationX, locationY);
        if (cell && selectionStart) {
          handleCellPressIn(cell.row, cell.col);
        }
      },
      onPanResponderRelease: () => {
        setSelectionStart(null);
      },
    })
  ).current;

  // Función para obtener la celda a partir de las coordenadas de pantalla
  const getCellFromLocation = (x, y) => {
    const row = Math.floor(y / 50); // Asumiendo altura de celda 50
    const col = Math.floor(x / 100); // Asumiendo ancho de celda 100
    if (
      row >= 0 &&
      row < rows.length &&
      col >= 0 &&
      col < columnHeaders.length
    ) {
      return { row, col };
    }
    return null;
  };

  // Limpiar selección cuando se toca fuera de cualquier celda o dentro de otra celda
  const clearSelection = () => {
    setSelectedCells([]);
    setSelectedContent("");
    setSelectedCell(null);
  };

  return (
    <TouchableWithoutFeedback onPress={clearSelection}>
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 4,
              marginBottom: 20,
              paddingHorizontal: 8,
            }}
          >
            <TouchableOpacity onPress={addRow} style={styles.iconButton}>
              <PlusCircle size={24} color={"darkgray"} />
              <Text style={styles.iconText}>Fila</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addColumn} style={styles.iconButton}>
              <PlusCircle size={24} color={"darkgray"} />
              <Text style={styles.iconText}>Columna</Text>
            </TouchableOpacity>
          </View>

          {/* Input para el contenido de la celda seleccionada */}
          <View
            style={{
              paddingHorizontal: 5,
              marginBottom: 5,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextInput
              style={styles.selectedContentInput}
              value={selectedContent}
              onChangeText={handleContentChange}
              placeholder="Selecciona una celda"
              editable={!!selectedCell} // Solo editable si hay una celda seleccionada
            />
            <TouchableOpacity style={styles.formatButton}>
              <Settings size={24} color={"darkgray"} />
            </TouchableOpacity>
          </View>

          {/* ScrollView horizontal para la tabla */}
          <ScrollView horizontal>
            <View>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.cell}>
                  <Text></Text>
                </View>
                {columnHeaders.map((header, colIndex) => (
                  <TouchableOpacity
                    key={colIndex}
                    onLongPress={() => handleColumnLongPress(colIndex)}
                  >
                    <View style={[styles.cell]}>
                      <TextInput
                        value={header}
                        onChangeText={(text) =>
                          updateColumnHeader(text, colIndex)
                        }
                        style={{ textAlign: "center" }}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Renderizar las filas con identificadores de fila */}
              {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onLongPress={() => handleRowLongPress(rowIndex)}
                  >
                    <View style={[styles.cell]}>
                      <TextInput
                        value={rowHeaders[rowIndex].toString()}
                        onChangeText={(text) => updateRowHeader(text, rowIndex)}
                        style={{ textAlign: "center" }}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Celdas de la tabla */}
                  {row.map((cell, colIndex) => {
                    const inputIndex = `${rowIndex}-${colIndex}`;
                    const isSelected = selectedCells.some(
                      (selected) =>
                        selected.row === rowIndex && selected.col === colIndex
                    );

                    return (
                      <TouchableOpacity
                        key={colIndex}
                        onPressIn={() => handleCellPressIn(rowIndex, colIndex)}
                      >
                        <View
                          style={[
                            styles.cell,
                            isSelected && styles.selectedCellBorder,
                          ]}
                        >
                          <TextInput
                            ref={(el) => (inputRefs.current[inputIndex] = el)}
                            value={cell}
                            onPressIn={() =>
                              handleCellPressIn(rowIndex, colIndex)
                            }
                            onChangeText={(text) =>
                              updateCell(text, rowIndex, colIndex)
                            }
                            style={{ padding: 5, textAlign: "center" }}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Estilos
const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 50,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCellBorder: {
    borderColor: "#B5D2B3",
    borderWidth: 2,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  iconText: {
    marginLeft: 5,
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
    paddingHorizontal: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
});
