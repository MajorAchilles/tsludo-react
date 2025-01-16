import type { Vertex } from './types';

/**
 * Draws a filled triangle on the canvas using the provided vertices and fill color.
 *
 * @param v1 - The first vertex of the triangle, with `x` and `y` coordinates.
 * @param v2 - The second vertex of the triangle, with `x` and `y` coordinates.
 * @param v3 - The third vertex of the triangle, with `x` and `y` coordinates.
 * @param fillColor - The color to fill the triangle with.
 * @param context - The canvas rendering context to draw on.
 * @returns None. The function only draws a filled triangle on the canvas.
 */
const fillTriangle = (
  v1: Vertex,
  v2: Vertex,
  v3: Vertex,
  fillColor: string,
  context: CanvasRenderingContext2D
) => {
  context.beginPath();
  context.moveTo(v1.x, v1.y);
  context.lineTo(v2.x, v2.y);
  context.lineTo(v3.x, v3.y);
  context.fillStyle = fillColor;
  context.fill();
  context.closePath();
};

/**
 * Draws a triangle on a canvas using the provided vertices, line width, stroke style, and canvas context.
 *
 * @param v1 - The first vertex of the triangle, defined as an object with `x` and `y` coordinates.
 * @param v2 - The second vertex of the triangle, defined as an object with `x` and `y` coordinates.
 * @param v3 - The third vertex of the triangle, defined as an object with `x` and `y` coordinates.
 * @param lineWidth - The width of the stroke used to draw the triangle.
 * @param strokeStyle - The color or style of the stroke used to draw the triangle.
 * @param context - The 2D rendering context of the canvas on which the triangle will be drawn.
 */
const strokeTriangle = (
  v1: Vertex,
  v2: Vertex,
  v3: Vertex,
  lineWidth: number,
  strokeSyle: string,
  context: CanvasRenderingContext2D
) => {
  context.beginPath();
  context.moveTo(v1.x, v1.y);
  context.lineTo(v2.x, v2.y);
  context.lineTo(v3.x, v3.y);
  context.lineWidth = lineWidth;
  context.strokeStyle = strokeSyle;
  context.stroke();
  context.closePath();
};

/**
 * Draws a circle on a canvas.
 *
 * @param center - The center coordinates of the circle.
 * @param radius - The radius of the circle.
 * @param lineWidth - The width of the stroke line.
 * @param strokeStyle - The color of the stroke.
 * @param context - The drawing context of the canvas.
 *
 * @example
 * const center = { x: 100, y: 100 };
 * const radius = 50;
 * const lineWidth = 2;
 * const strokeStyle = 'red';
 * const canvas = document.getElementById('myCanvas');
 * const context = canvas.getContext('2d');
 *
 * strokeCircle(center, radius, lineWidth, strokeStyle, context);
 *
 * @remarks
 * This function uses the provided parameters to draw a circle on the canvas using the stroke style and line width specified.
 * The circle is drawn using the center coordinates and the radius provided.
 * The drawing is performed on the provided drawing context of the canvas.
 */
const strokeCircle = (
  center: Vertex,
  radius: number,
  lineWidth: number,
  strokeStyle: string,
  context: CanvasRenderingContext2D
) => {
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  context.lineWidth = lineWidth;
  context.strokeStyle = strokeStyle;
  context.stroke();
  context.closePath();
};

/**
 * Draws a filled circle on a canvas using the provided center coordinates, radius, fill style, and canvas context.
 *
 * @param center - An object representing the center coordinates of the circle, with properties `x` and `y` of type `number`.
 * @param radius - A number representing the radius of the circle.
 * @param fillStyle - A string representing the fill color/style of the circle.
 * @param context - A `CanvasRenderingContext2D` object representing the canvas context on which the circle will be drawn.
 * @returns None. The function only draws a filled circle on the canvas.
 */
const fillCircle = (
  center: Vertex,
  radius: number,
  fillStyle: string,
  context: CanvasRenderingContext2D
) => {
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  context.fillStyle = fillStyle;
  context.fill();
  context.closePath();
};

/**
 * Calculates the easing effect for a given time value.
 *
 * @param time - The time value for which the easing effect needs to be calculated. Has to be normalized between 0 and 1
 * @returns The easing value calculated based on the input `time` value.
 */
const easeOut = (time: number) => {
  if (time > 1)
    throw new Error(`'Time value cannot be greater than 1. Arg value: ${time}`);
  if (time < 0)
    throw new Error(`'Time value cannot be less than 0. Arg value: ${time}`);
  return 1 - (1 - time) ** 2;
};

/**
 * Calculates the easing effect of time.
 *
 * @param time - The time value for which the easing effect needs to be calculated. It should be a number between 0 and 1.
 * @returns The easing effect of the time value, which is the square of the input value.
 * @throws Error if the time value is greater than 1 or less than 0.
 *
 * @example
 */
const easeIn = (time: number) => {
  if (time > 1)
    throw new Error(`'Time value cannot be greater than 1. Arg value: ${time}`);

  if (time < 0)
    throw new Error(`'Time value cannot be less than 0. Arg value: ${time}`);

  return time ** 2;
};

/**
 * Calculates the square of a given time value.
 *
 * @param time - The time value to be squared.
 * @returns The square of the time value.
 * @throws {Error} If the time value is greater than 1 or less than 0.
 *
 * @example
 * import { easeIn } from './utils';
 *
 * const time = 0.5;
 * const result = easeIn(time);
 * console.log(result); // Output: 0.25
 */
const easeInOut = (time: number) => {
  if (time > 1)
    throw new Error(`'Time value cannot be greater than 1. Arg value: ${time}`);
  if (time < 0)
    throw new Error(`'Time value cannot be less than 0. Arg value: ${time}`);
  return time < 0.5 ? 2 * time ** 2 : 1 - (-2 * time + 2) ** 2 / 2;
};

export {
  easeIn,
  easeInOut,
  easeOut,
  fillCircle,
  fillTriangle,
  strokeCircle,
  strokeTriangle,
};
