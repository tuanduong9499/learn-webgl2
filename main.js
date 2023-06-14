// Tạo một đối tượng canvas để hiển thị đồ họa
const canvas = document.querySelector('canvas');
document.body.appendChild(canvas);

// Tạo một đối tượng WebGL2 context
const gl = canvas.getContext('webgl2');

// Tạo một đối tượng Image để tải ảnh lên
const image = new Image();
image.src = './assets/square.png';

// Đợi cho ảnh được tải lên hoàn tất
image.onload = function() {
  // Tạo một texture để chứa ảnh
  const texture = gl.createTexture();

  // Liên kết texture với đối tượng ảnh
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Cấu hình texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Tạo các đỉnh để vẽ ảnh lên màn hình
  const vertices = [
    // Tọa độ     // Tọa độ texture
    -1,  1, 0,    0, 0,
    -1, -1, 0,    0, 1,
     1,  1, 0,    1, 0,
     1, -1, 0,    1, 1
  ];

  // Tạo một buffer để lưu trữ các đỉnh
  const vertexBuffer = gl.createBuffer();

  // Liên kết buffer với ARRAY_BUFFER
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Sao chép dữ liệu vào buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Tạo shader program để vẽ ảnh
  const vertexShaderSrc = `
    attribute vec3 aPosition;
    attribute vec2 aTextureCoord;
    varying vec2 vTextureCoord;
    void main() {
      gl_Position = vec4(aPosition, 1.0);
      vTextureCoord = aTextureCoord;
    }
  `;

  const fragmentShaderSrc = `
    precision highp float;
    uniform sampler2D uSampler;
    varying vec2 vTextureCoord;
    void main() {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSrc);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSrc);
  gl.compileShader(fragmentShader);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // Lấy vị trí các attribute và uniform trong shader program
  const positionAttributeLocation = gl.getAttribLocation(program, 'aPosition');
  const textureCoordAttributeLocation = gl.getAttribLocation(program, 'aTextureCoord');
  const samplerUniformLocation = gl.getUniformLocation(program, 'uSampler');

  // Kích hoạt các attribute
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.enableVertexAttribArray(textureCoordAttributeLocation);

  // Liên kết buffer với attribute
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 20, 0);
  gl.vertexAttribPointer(textureCoordAttributeLocation, 2, gl.FLOAT, false, 20, 12);

  // Sử dụng shader program để vẽ ảnh
  gl.useProgram(program);

  // Liên kết texture với uniform
  gl.uniform1i(samplerUniformLocation,0);

  // Vẽ ảnh lên màn hình
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};