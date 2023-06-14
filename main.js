const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl2");

// Định nghĩa các shader
const vertexShaderSource = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0, 1);
}
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec4 uColor;
void main() {
  gl_FragColor = uColor;
}
`;

// Biên dịch và liên kết các shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

// Gán giá trị cho các biến và các thuộc tính
const positionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
const colorLocation = gl.getUniformLocation(shaderProgram, "uColor");

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, 0, 0.5, 0, 0, 0.5]), gl.STATIC_DRAW);

// Render
gl.useProgram(shaderProgram);

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.uniform4f(colorLocation, 1, 0, 0, 1);

gl.drawArrays(gl.TRIANGLES, 0, 3);