import _ from 'lodash';

class ParameterMissingError extends Error {
  constructor (public message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}
class Parameters<T> {
  public _attrs: T | {};

  public _params: {[key: string]: any};

  public _filters: any[];
  parameters: {};

  constructor (attributes: undefined | T) {
    this._attrs = attributes || {};
    this._params = {};
    this._filters = [];
    if (attributes instanceof Array) {
      this._params = attributes.map(Parameters._initValue);
    } else {
      for (const key in attributes) {
        const value = attributes[key];
        this._params[key] = Parameters._initValue(value);
      }
    }
  }

  static readonly PRIMITIVE_TYPES = [Boolean, Number, String, function Null () { }];

  static _initValue (value: any) {
    return !Parameters._isPrimitive(value) ? new Parameters(value) : value;
  }

  static _isPrimitive (value: any) {
    return Parameters.PRIMITIVE_TYPES.some((Primitive) => [typeof value, String(value)].some((val) => val === Primitive.name.toLowerCase()));
  }

  static clone (value: any) {
    return value instanceof Parameters ? value.clone() : value;
  }

  static _cloneArray (params: any) {
    return params.map((param: any) => Parameters.clone(param));
  }

  static _cloneObject (params: any) {
    return _.transform(params, (result: { [key: string]: any }, value: any, key: string) => {
      result[key] = Parameters.clone(value);
    }, {});
  }

  public require (key: string) {
    const param = Parameters.clone(this._fetch(key));
    if (!param) throw new ParameterMissingError(`param ${key} required`);
    if (!(param instanceof Parameters)) throw new Error(`param ${key} is not a Parameters instance`);
    return param;
  }

  public permit (filters: any[]) {
    const _this = this.clone();
    _this._filters = filters || [];
    return _this;
  }

  public all () { return _.cloneDeep(this._attrs); }

  public value () {
    const _this = this.clone();
    const params: any = {};
    _this._filters.forEach((filter) => {
      if (typeof filter === 'object') {
        _this._permitObject(params, filter);
      } else {
        _this._permitPrimitive(params, filter);
      }
    });
    return params;
  }

  public clone () {
    const _this = _.cloneDeep(this);
    const parameters = new Parameters(undefined);
    parameters._attrs = _.cloneDeep(this._attrs ?? {});
    parameters._filters = _.cloneDeep(this._filters ?? []);
    parameters._params = (function () {
      if (_.isArray(_this._params)) {
        return Parameters._cloneArray(_this._params);
      } if (_.isObject(_this._params)) {
        return Parameters._cloneObject(_this._params);
      }
      throw new Error('Invalid parameter value');
    }());
    return parameters;
  }

  public _fetch (key: string) { return this._params[key]; }

  public _hasKey (key: string) { return this._fetch(key) !== undefined; }

  public _permitPrimitive (params: { [key: string]: any }, key: string) {
    if (this._hasKey(key) && Parameters._isPrimitive(this._fetch(key))) {
      params[key] = this._fetch(key);
    }
  }

  public _permitObject (params: { [key: string]: any }, filters: any[]) {
    for (const key in filters) {
      let param: any;
      let isArrObj: boolean = false;
      const filtersArray = filters[key];
      if (_.isArray(filtersArray) && (param = this._fetch(key))) {
        if (Parameters._isPrimitive(param)) {
          continue;
        }
        if (_.isArray(param._params) || (isArrObj = Object.keys(param._params).every((i) => !_.isNaN(Number(i))))) {
          if (isArrObj) {
            params[key] = _.transform(param._params, (result: { [key: string]: any }, value, key: string) => {
              result[key] = Parameters._isPrimitive(value) ? value : value.permit(filtersArray).value();
            }, {});
          } else if (!param._params.some(Parameters._isPrimitive)) {
            params[key] = param._params.map((p: any) => p.permit(filtersArray).value());
          } else {
            params[key] = param._params.filter((p: any) => Parameters._isPrimitive(p));
          }
          continue;
        }
        if (filtersArray.length > 0 && param instanceof Parameters) {
          params[key] = param.permit(filtersArray).value();
          continue;
        }
      }
    }
  }
}

export default Parameters;
