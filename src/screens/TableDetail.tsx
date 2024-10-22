import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

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

  // Estado para almacenar tanto las filas, como las celdas identificadoras
  const [rows, setRows] = useState(initialRows); // Inicializamos con 3 filas y 2 columnas
  const [columnHeaders, setColumnHeaders] = useState(initialColumnHeaders); // Inicializamos con 2 columnas
  const [rowHeaders, setRowHeaders] = useState(initialRowHeaders); // Inicializamos con 3 filas

  // Estado para controlar qué celda identificadora está en modo edición
  const [editingColumnIndex, setEditingColumnIndex] = useState(null);
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  // Estados para controlar la selección de filas, columnas y celdas
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
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

  // Función para actualizar el valor de un encabezado de columna
  const updateColumnHeader = (text, colIndex) => {
    const newHeaders = [...columnHeaders];
    newHeaders[colIndex] = text;
    setColumnHeaders(newHeaders);
  };

  // Función para actualizar el valor de un encabezado de fila
  const updateRowHeader = (text, rowIndex) => {
    const newHeaders = [...rowHeaders];
    newHeaders[rowIndex] = text;
    setRowHeaders(newHeaders);
  };

  // Función para seleccionar una columna al mantener el clic
  const handleColumnLongPress = (colIndex) => {
    setSelectedColumn(colIndex);
    setSelectedRow(null);
    setSelectedCell({ row: null, col: null }); // Limpiar selección de fila y celda
  };

  // Función para seleccionar una fila al mantener el clic
  const handleRowLongPress = (rowIndex) => {
    setSelectedRow(rowIndex);
    setSelectedColumn(null);
    setSelectedCell({ row: null, col: null }); // Limpiar selección de columna y celda
  };

  // Función para seleccionar una celda específica
  const handleCellPress = (rowIndex, colIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    setSelectedColumn(null);
    setSelectedRow(null); // Limpiar selección de fila y columna
  };

  // Función para deseleccionar al hacer clic en cualquier lugar fuera de las celdas
  const clearSelection = () => {
    setSelectedColumn(null);
    setSelectedRow(null);
    setSelectedCell({ row: null, col: null }); // Limpiar selección de celda
  };

  return (
    <TouchableWithoutFeedback onPress={clearSelection}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "white", paddingVertical: 20 }}
      >
        {/* Botones para agregar filas y columnas */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Button title="Agregar Fila" onPress={addRow} />
          <Button title="Agregar Columna" onPress={addColumn} />
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
                  onPress={() => setEditingColumnIndex(colIndex)}
                  onLongPress={() => handleColumnLongPress(colIndex)} // Detectar "long press" en la columna
                >
                  <View
                    style={[
                      styles.cell,
                      selectedColumn === colIndex && styles.selectedCell, // Estilo si la columna está seleccionada
                      selectedColumn === colIndex && styles.selectedCellBorder, // Cambiar color del borde
                    ]}
                  >
                    {editingColumnIndex === colIndex ? (
                      <TextInput
                        value={header}
                        onChangeText={(text) =>
                          updateColumnHeader(text, colIndex)
                        }
                        style={{
                          padding: 5,
                          width: 100,
                          textAlign: "center",
                        }}
                        onBlur={() => setEditingColumnIndex(null)}
                      />
                    ) : (
                      <Text>{header}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Renderizar las filas con identificadores de fila */}
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: "row" }}>
                {/* Celda identificadora de fila (1, 2, 3, ...) */}
                <TouchableOpacity
                  onPress={() => setEditingRowIndex(rowIndex)}
                  onLongPress={() => handleRowLongPress(rowIndex)} // Detectar "long press" en la fila
                >
                  <View
                    style={[
                      styles.cell,
                      selectedRow === rowIndex && styles.selectedCell, // Estilo si la fila está seleccionada
                      selectedRow === rowIndex && styles.selectedCellBorder, // Cambiar color del borde
                    ]}
                  >
                    {editingRowIndex === rowIndex ? (
                      <TextInput
                        value={rowHeaders[rowIndex].toString()}
                        onChangeText={(text) => updateRowHeader(text, rowIndex)}
                        style={{
                          padding: 5,
                          width: 100,
                          textAlign: "center",
                        }}
                        onBlur={() => setEditingRowIndex(null)}
                      />
                    ) : (
                      <Text>{rowHeaders[rowIndex]}</Text>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Celdas de la tabla */}
                {row.map((cell, colIndex) => (
                  <TouchableOpacity
                    key={colIndex}
                    onPress={() => handleCellPress(rowIndex, colIndex)} // Seleccionar una celda específica
                  >
                    <TextInput
                      value={cell}
                      onChangeText={(text) =>
                        updateCell(text, rowIndex, colIndex)
                      }
                      style={[
                        styles.cell,
                        // Si la fila, columna o celda está seleccionada, cambiar el estilo de la celda
                        selectedRow === rowIndex ||
                        selectedColumn === colIndex ||
                        (selectedCell.row === rowIndex &&
                          selectedCell.col === colIndex)
                          ? styles.selectedCell
                          : null,
                        // Cambiar color del borde también si la fila, columna o celda está seleccionada
                        selectedRow === rowIndex ||
                        selectedColumn === colIndex ||
                        (selectedCell.row === rowIndex &&
                          selectedCell.col === colIndex)
                          ? styles.selectedCellBorder
                          : null,
                        // Añadir paddingLeft para el texto
                        { paddingLeft: 10 },
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

// Estilos para las celdas seleccionadas
const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 50,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#000", // Color del borde por defecto
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCell: {
    backgroundColor: "#d0eaff", // Color de fondo cuando está seleccionada
  },
  selectedCellBorder: {
    borderColor: "#4A90E2", // Cambiar color del borde cuando está seleccionada
  },
});
