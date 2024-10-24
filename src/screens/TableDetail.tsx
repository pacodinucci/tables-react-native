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
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });

  // Función para actualizar una celda en la tabla
  const updateCell = (text, rowIndex, colIndex) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = text;
    setRows(newRows);
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

  // Función para seleccionar una columna completa con long press
  const handleColumnLongPress = (colIndex) => {
    setSelectedColumn(colIndex);
    setSelectedRow(null);
    setSelectedCell({ row: null, col: null });
  };

  // Función para seleccionar una fila completa con long press
  const handleRowLongPress = (rowIndex) => {
    setSelectedRow(rowIndex);
    setSelectedColumn(null);
    setSelectedCell({ row: null, col: null });
  };

  // Función para seleccionar una celda específica con long press
  const handleCellLongPress = (rowIndex, colIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    setSelectedRow(null);
    setSelectedColumn(null);
  };

  // Limpiar selección cuando se toca fuera de cualquier celda o dentro de otra celda
  const clearSelection = () => {
    setSelectedColumn(null);
    setSelectedRow(null);
    setSelectedCell({ row: null, col: null });
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
                    onPress={clearSelection} // Deseleccionar al tocar otra columna
                    onLongPress={() => handleColumnLongPress(colIndex)} // Seleccionar toda la columna con long press
                  >
                    <View
                      style={[
                        styles.cell,
                        selectedColumn === colIndex && styles.selectedColumn,
                      ]}
                    >
                      <Text>{header}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Renderizar las filas con identificadores de fila */}
              {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: "row" }}>
                  {/* Celda identificadora de fila (1, 2, 3, ...) */}
                  <TouchableOpacity
                    onPress={clearSelection} // Deseleccionar al tocar otra fila
                    onLongPress={() => handleRowLongPress(rowIndex)} // Seleccionar toda la fila con long press
                  >
                    <View
                      style={[
                        styles.cell,
                        selectedRow === rowIndex && styles.selectedRow,
                      ]}
                    >
                      <Text>{rowHeaders[rowIndex]}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Celdas de la tabla */}
                  {row.map((cell, colIndex) => {
                    const inputIndex = `${rowIndex}-${colIndex}`; // Crear un índice único para la celda
                    return (
                      <TouchableOpacity
                        key={colIndex}
                        onPress={() => {
                          clearSelection(); // Limpiar selección
                          inputRefs.current[inputIndex]?.focus(); // Activar el input al tocar la celda
                        }}
                        onLongPress={() =>
                          handleCellLongPress(rowIndex, colIndex)
                        } // Seleccionar una celda específica con long press
                      >
                        <View
                          style={[
                            styles.cell,
                            selectedCell.row === rowIndex &&
                            selectedCell.col === colIndex
                              ? styles.selectedCell
                              : null,
                            // Aplicar el color azul para la fila o columna seleccionada
                            selectedRow === rowIndex && styles.selectedRow,
                            selectedColumn === colIndex &&
                              styles.selectedColumn,
                          ]}
                        >
                          <TextInput
                            ref={(el) => (inputRefs.current[inputIndex] = el)} // Guardar la referencia de cada input
                            value={cell}
                            onPressIn={() => {
                              clearSelection(); // Limpiar selección al tocar el input
                              inputRefs.current[inputIndex]?.focus(); // Foco en el input
                            }}
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
  selectedRow: {
    backgroundColor: "#d0eaff", // Color para toda la fila seleccionada (azul)
  },
  selectedColumn: {
    backgroundColor: "#d0eaff", // Color para toda la columna seleccionada (azul)
  },
  selectedCell: {
    backgroundColor: "#a4de02", // Color verde para celdas seleccionadas individualmente
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
