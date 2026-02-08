import {
  Alert,
  Button,
  Checkbox,
  Collapse,
  CollapsePanel,
  Empty,
  Form,
  FormItem,
  Input,
  InputPassword,
  Modal,
  Radio,
  RadioGroup,
  Rate,
  Result,
  Select,
  SelectOption,
  Spin,
  TabPane,
  Tabs,
  Textarea,
  Upload,
} from 'ant-design-vue';

const components = [
  Alert,
  Button,
  Checkbox,
  Collapse,
  CollapsePanel,
  Empty,
  Form,
  FormItem,
  Input,
  InputPassword,
  Modal,
  Radio,
  RadioGroup,
  Rate,
  Result,
  Select,
  SelectOption,
  Spin,
  TabPane,
  Tabs,
  Textarea,
  Upload,
];

export default defineNuxtPlugin(nuxtApp => {
  components.forEach(component => {
    nuxtApp.vueApp.component(component.name!, component);
  });
});
