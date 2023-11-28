import { Dimensions, PixelRatio } from 'react-native';

class LayoutAdaptorService {
  private designWidth = 390;
  private designHeight = 844;
  private minimalFactor = 1;

  private factorWidth = 1;
  private factorHeight = 1;
  private factorAverage = 1;

  WIDTH_SMALLER_THAN_DESIGN = false;
  HEIGHT_SMALLER_THAN_DESIGN = false;

  constructor() {
    this.init();
  }

  init() {
    const { height, width } = Dimensions.get('window');

    const factorWidth = width / this.designWidth;
    const factorHeight = height / this.designHeight;

    this.WIDTH_SMALLER_THAN_DESIGN = factorWidth < 1;
    this.HEIGHT_SMALLER_THAN_DESIGN = factorHeight < 1;

    this.factorWidth =
      factorWidth < this.minimalFactor
        ? (factorWidth + this.minimalFactor) / 2
        : factorWidth;

    this.factorHeight =
      factorHeight < this.minimalFactor
        ? (factorHeight + this.minimalFactor) / 2
        : factorHeight;

    this.factorAverage = (this.factorWidth + this.factorHeight) / 2;
  }

  w(n: number, degree = 1) {
    return PixelRatio.roundToNearestPixel(
      Math.pow(this.factorWidth, this.WIDTH_SMALLER_THAN_DESIGN ? degree : 1) *
        n,
    );
  }

  h(n: number, degree = 1) {
    return PixelRatio.roundToNearestPixel(
      Math.pow(
        this.factorHeight,
        this.HEIGHT_SMALLER_THAN_DESIGN ? degree : 1,
      ) * n,
    );
  }

  wh(n: number, degree = 1) {
    return PixelRatio.roundToNearestPixel(
      Math.pow(
        this.factorAverage,
        this.WIDTH_SMALLER_THAN_DESIGN || this.HEIGHT_SMALLER_THAN_DESIGN
          ? degree
          : 1,
      ) * n,
    );
  }
}

const LayoutAdaptor = new LayoutAdaptorService();

export default LayoutAdaptor;
