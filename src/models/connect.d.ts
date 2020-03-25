import { AnyAction, Dispatch } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { UserModelState } from './user';
import { LoginModelState } from './login';
import { HomeModelState } from './home';
import { FeedbackModelState } from './feedback';
import { HedgingModelState } from './hedging';
import { CompanyModelState } from './company';
import { OrderState } from './order';
import { ApplicationModelState } from './application';
import { RoleModelState } from './role';
import { MenuModelState } from './menu';
import { CategoryModelState } from './category';
import { IntegralModelState } from './integral';
import { InformationModelState } from './information';
import { CarouselModelState } from './carousel';
import { AdvertisementModelState } from './startPage';


export { GlobalModelState, SettingModelState, UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
    home?: boolean;
    feedback?: boolean;
    company?: boolean;
    order?: boolean;
    hedging?: boolean;
    category?: boolean;
    application?: boolean;
    integral?: boolean;
    role?: boolean;
    information?: boolean;
    advertisement?: boolean;
    carousel?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  login: LoginModelState;
  home: HomeModelState;
  feedback: FeedbackModelState;
  company: CompanyModelState;
  order: OrderState;
  hedging: HedgingModelState;
  category: CategoryModelState;
  application: ApplicationModelState;
  integral: IntegralModelState;
  role: RoleModelState;
  menu: MenuModelState;
  information: InformationModelState;
  carousel: CarouselModelState;
  advertisement: AdvertisementModelState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
