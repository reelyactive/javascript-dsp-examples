/**
 * Copyright reelyActive 2025
 * Original FFT code Copyright Vail Systems 2015 (Joshua Jung & Ben Bryan)
 * We believe in an open Internet of Things
 */


/**
 * Calculate the root mean square of the given values.
 * @param {Array} values The values.
 * @return {Number} The root mean square of the values.
 */
function rms(values) {
  if(!Array.isArray(values)) {
    return null;
  }

  let sumOfSquares = values.reduce((sum, value) => sum + (value * value));

  return Math.sqrt(sumOfSquares / values.length);
}


/**
 * Apply a Hann window to the given series of samples (without modifying the
 * source samples).
 * @param {Array} samples The samples.
 * @return {Array} A new Array of samples with the Hann window applied.
 */
function hannWindow(samples) {
  return samples.map((sample, index) => sample *
          (1 - Math.pow(Math.cos(Math.PI * index / (samples.length - 1)), 2)));
}


/**
 * Perform a Fast Fourier Transform using the Cooley-Tukey method.
 * Adapted from https://github.com/vail-systems/node-fft
 * @param {Array} samples The time series of samples.
 * @param {Number} samplingRate The sampling rate (in Hz) of the samples.
 * @return {Object} Arrays of magnitudes and frequencies (in Hz).
 */
function fft(samples, samplingRate) {
  if(!Array.isArray(samples) || !Number.isFinite(samplingRate)) {
    return null;
  }

  let phasors = fftPhasors(samples);
  let stepFrequency = samplingRate / phasors.length;
  let magnitudes = phasors.map(complexMagnitude).slice(0, phasors.length / 2);
  let frequencies = magnitudes.map((element, index) => index * stepFrequency); 

  return { magnitudes: magnitudes,
           frequencies: frequencies,
           numberOfBins: magnitudes.length };
}


/**
 * Calculate the phasors of a Fast Fourier Transform using the Cooley-Tukey
 * method with self-recursion.
 * Adapted from https://github.com/vail-systems/node-fft
 * @param {Array} vectors The time series of samples/vectors.
 * @return {Array} The phasors as an array of arrays, where the latter is in
 *                 [ magnitude, phase ] format.
 */
function fftPhasors(vectors) {
  let phasors = [];

  // For a single-entry vector, return the magnitude and phase.
  if(vectors.length === 1) {
    let isComplex = Array.isArray(vectors[0]);
    if(isComplex) {
      return [ [ vectors[0][0], vectors[0][1] ] ];   
    }   
    else {
      return [ [ vectors[0], 0 ] ];
    }
  }

  // For longer vectors, split into even and odd samples
  let evenVectors = vectors.filter((vector, index) => index % 2 === 0);
  let oddVectors = vectors.filter((vector, index) => index % 2 === 1);

  // Self-recurse on the even and odd samples
  let evenPhasors = fftPhasors(evenVectors);
  let oddPhasors = fftPhasors(oddVectors);

  // The number of operations is now reduced to N/2
  for(let k = 0; k < (vectors.length / 2); k++) {
    let t = evenPhasors[k];
    let e = complexMultiply(exponent(k, vectors.length), oddPhasors[k]);

    phasors[k] = complexAdd(t, e);
    phasors[k + (vectors.length / 2)] = complexSubtract(t, e);
  }

  return phasors;
}


/**
 * Determine the exponent as a complex number.
 * Adapted from https://github.com/vail-systems/node-fft
 * @param {Number} k k.
 * @param {Number} N N.
 * @return {Array} The exponent as a complex number [ real, imaginary ].
 */
function exponent(k, N) {
  let mapExponent = {};
  let x = -2 * Math.PI * (k / N);

  mapExponent[N] = mapExponent[N] || {};
  mapExponent[N][k] = mapExponent[N][k] || [ Math.cos(x), Math.sin(x) ];

  return mapExponent[N][k];
}


/**
 * Multiply two complex numbers.
 * Adapted from https://github.com/vail-systems/node-fft
 * @param {Array} a The first complex number [ real, imaginary ].
 * @param {Array} b The second complex number [ real, imaginary ].
 * @return {Array} The product as a complex number [ real, imaginary ].
 */
function complexMultiply(a, b) {
  return [ (a[0] * b[0] - a[1] * b[1]), 
           (a[0] * b[1] + a[1] * b[0]) ];
};


/**
 * Add two complex numbers.
 * Adapted from https://github.com/vail-systems/node-fft
 * @param {Array} a The first complex number [ real, imaginary ].
 * @param {Array} b The second complex number [ real, imaginary ].
 * @return {Array} The sum as a complex number [ real, imaginary ].
 */
function complexAdd(a, b) {
  return [ a[0] + b[0], a[1] + b[1] ];
};


/**
 * Subtract two complex numbers.
 * Adapted from https://github.com/vail-systems/node-fft
 * @param {Array} a The first complex number [ real, imaginary ].
 * @param {Array} b The second complex number [ real, imaginary ].
 * @return {Array} The difference as a complex number [ real, imaginary ].
 */
function complexSubtract(a, b) {
  return [ a[0] - b[0], a[1] - b[1] ];
};


/**
 * Determine the magnitude of a complex number.
 * Adapted from https://github.com/vail-systems/node-fft
 * @param {Array} c The complex number [ real, imaginary ].
 * @return {Number} The magnitude as a real number.
 */
function complexMagnitude(c) {
  return Math.sqrt(c[0] * c[0] + c[1] * c[1]); 
}


module.exports.rms = rms;
module.exports.hannWindow = hannWindow;
module.exports.fft = fft;