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
import { PlusCircle } from "lucide-react-native";

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

  // Referencia para los inputs
  const inputRefs = useRef([]); // Array de referencias para todos los inputs

  // Estados para la selección
  const [selectedCells, setSelectedCells] = useState([]); // Array de celdas seleccionadas en el formato {row, col}
  const [selectionStart, setSelectionStart] = useState(null); // Punto inicial de la selección

  // Función para actualizar una celda en la tabla
  const updateCell = (text, rowIndex, colIndex) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = text;
    setRows(newRows);
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

  // Función para seleccionar un rango de celdas
  const selectRange = (start, end) => {
    const newSelectedCells = [];

    for (
      let row = Math.min(start.row, end.row);
      row <= Math.max(start.row, end.row);
      row++
    ) {
      for (
        let col = Math.min(start.col, end.col);
        col <= Math.max(start.col, end.col);
        col++
      ) {
        newSelectedCells.push({ row, col });
      }
    }

    setSelectedCells(newSelectedCells);
  };

  // Función para iniciar la selección de celdas y enfocar el input
  const handleCellPressIn = (rowIndex, colIndex) => {
    const start = { row: rowIndex, col: colIndex };
    setSelectionStart(start);
    setSelectedCells([start]); // Selecciona la celda inicial
    inputRefs.current[`${rowIndex}-${colIndex}`]?.focus(); // Enfocar el input al tocar la celda
  };

  // Función para actualizar la selección de celdas mientras se arrastra
  const handleCellPressMove = (rowIndex, colIndex) => {
    if (selectionStart) {
      selectRange(selectionStart, { row: rowIndex, col: colIndex });
    }
  };

  // Función para seleccionar una columna completa con long press
  const handleColumnLongPress = (colIndex) => {
    const newSelectedCells = [];
    for (let row = 0; row < rows.length; row++) {
      newSelectedCells.push({ row, col: colIndex });
    }
    setSelectedCells(newSelectedCells); // Seleccionar todas las celdas de la columna
  };

  // Función para seleccionar una fila completa con long press
  const handleRowLongPress = (rowIndex) => {
    const newSelectedCells = [];
    for (let col = 0; col < columnHeaders.length; col++) {
      newSelectedCells.push({ row: rowIndex, col });
    }
    setSelectedCells(newSelectedCells); // Seleccionar todas las celdas de la fila
  };

  // Limpiar selección cuando se toca fuera de cualquier celda o dentro de otra celda
  const clearSelection = () => {
    setSelectedCells([]);
    setSelectionStart(null);
  };

  return (
    <TouchableWithoutFeedback onPress={clearSelection}>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: "white", paddingVertical: 20 }}
        >
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

          {/* ScrollView horizontal para la tabla */}
          <ScrollView horizontal>
            <View>
              {/* Encabezados de las columnas */}
              <View style={{ flexDirection: "row" }}>
                {/* Primera celda vacía en la esquina */}
                <View
                  style={{
                    width: 100,
                    height: 50,
                    backgroundColor: "#f0f0f0",
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text></Text>
                </View>
                {/* Celdas identificadoras de columnas (A, B, ...) */}
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
                  {/* Celda identificadora de fila (1, 2, 3, ...) */}
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
                        onPressOut={() => setSelectionStart(null)}
                        onPress={() => handleCellPressMove(rowIndex, colIndex)}
                      >
                        <View
                          style={[
                            styles.cell,
                            isSelected && styles.selectedCellBorder,
                          ]}
                        >
                          <TextInput
                            ref={(el) => (inputRefs.current[inputIndex] = el)} // Guardar la referencia de cada input
                            value={cell}
                            onPressIn={() =>
                              handleCellPressIn(rowIndex, colIndex)
                            } // Seleccionar la celda al tocar el input
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

// Estilos para las celdas seleccionadas y botones de icono
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
    borderColor: "#B5D2B3", // Borde verde para la celda seleccionada individualmente
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
});
