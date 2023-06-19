// Tạo một đối tượng canvas để hiển thị đồ họa
const canvas = document.querySelector('canvas');
document.body.appendChild(canvas);

// Tạo một đối tượng WebGL2 context
const gl = canvas.getContext('webgl2');

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
`;
// Khởi tạo buffer chứa dữ liệu vertex của hình tam giác
const vertices_triangle = [
  -0.5, 0.5,
  -0.5, -0.5,
  0.5, -0.5
];
const vertexBuffer_triangle = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer_triangle);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_triangle), gl.STATIC_DRAW);

// Khởi tạo buffer chứa dữ liệu vertex của hình vuông
const vertices_square = [
  -0.5, 0.5,
  -0.5, -0.5,
  0.5, 0.5,
  0.5, -0.5
];
const vertexBuffer_square = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer_square);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_square), gl.STATIC_DRAW);

// Khởi tạo shader program và lấy vị trí các thuộc tính và uniform
const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position');
const colorUniformLocation = gl.getUniformLocation(shaderProgram, 'u_color');

function drawTriangle() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Vẽ hình tam giác
  gl.useProgram(shaderProgram);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer_triangle);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniform4f(colorUniformLocation, 1.0, 0.0, 0.0, 1.0); // Màu đỏ

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function drawSquare() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Vẽ hình vuông
  gl.useProgram(shaderProgram);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer_square);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniform4f(colorUniformLocation, 0.0, 1.0, 0.0, 1.0); // Màu xanh lá cây

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

// Hàm tạo shader program từ mã nguồn vertex shader và fragment shader
function createShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
    return null;
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
    return null;
  }

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Shader program linking error:', gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function convertToSquare() {
  // Cập nhật buffer chứa dữ liệu vertex của hình vuông
  const vertices = [
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, 0.5,
    0.5, -0.5
  ];
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer_square);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Vẽ hình vuông
  drawSquare();
}

// Vẽ hình tam giác ban đầu
drawTriangle();

// Chuyển đổi sang hình vuông khi nhấn phím "S"
document.addEventListener('keydown', function(event) {
  if (event.keyCode === 83) { // Phím "S"
    convertToSquare();
  }else if(event.key === "a"){
    drawTriangle();
  }
});