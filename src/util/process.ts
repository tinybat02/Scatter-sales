import { Frame } from '../types';

export const processData = (data: Array<Frame>) => {
  const xData: number[] = [];
  const yData: number[] = [];
  const zData: number[] = [];
  const textData: string[] = [];

  const xStore: { [key: string]: number } = {};
  const yStore: { [key: string]: number } = {};
  const zStore: { [key: string]: number } = {};

  data.map(row => {
    const sum = row.fields[0].values.buffer.reduce((total, el) => total + el, 0);
    const area_name = row.name || '';

    if (area_name.startsWith('_')) zStore[area_name.substring(1)] = Math.round(sum);
    else if (area_name.startsWith('0_')) xStore[area_name.substring(2)] = Math.round(sum);
    else yStore[area_name] = Math.round(sum / 600) * 10;
  });

  Object.keys(xStore).map(store => {
    if (zStore[store] && yStore[store]) {
      xData.push(xStore[store]);
      yData.push(yStore[store]);
      zData.push(zStore[store]);
      textData.push(store);
    }
  });

  return {
    result: [
      {
        x: xData,
        y: yData,
        z: zData,
        text: textData,
        hovertemplate: '<b>%{text}</b><br>' + '%{z} Pieces<br>' + '%{x} Visitors<br>' + '%{y} min',
        type: 'scatter3d',
        mode: 'markers',
        marker: { size: 5 },
      },
    ],
  };
};
