import * as React from "react";
import * as Yup from "yup";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Formik, Form, Field } from "formik";
import { Grid } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import DatePickerField from "./DatePickerField";
import ruLocale from "date-fns/locale/ru";
import TextField from "@material-ui/core/TextField";
import "./styles.css";
import { Button } from "@material-ui/core";

interface DraftForm {
  startedAt: string | null;
  expiredAt: string | null;
  title: string;
}

const defaultValuesForm = (): DraftForm => {
  return {
    startedAt: new Date().toISOString().slice(0, 10),
    expiredAt: new Date().toISOString().slice(0, 10),
    title: ""
  };
};

class App extends React.PureComponent {
  public formSubmit = (values: DraftForm) => {
    console.log(values);
  };

  public renderFormic = () => {
    const formSchema = Yup.object().shape({
      title: Yup.string()
        .min(3, "Минимум 3")
        .max(10, "Максимум 10")
        .required("Обязательно для заполнения"),
      startedAt: Yup.date()
        .typeError("Не валидная дата")
        .required("Обязательно для заполнения")
        .min(new Date(), "Дата должна быть больше текущей"),
      expiredAt: Yup.date()
        .typeError("Не валидная дата")
        .required("Обязательно для заполнения")
        .min(new Date(), "Дата должна быть больше текущей")
    });
    return (
      <Formik<DraftForm>
        initialValues={{
          ...defaultValuesForm()
        }}
        validationSchema={formSchema}
        onSubmit={this.formSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldError
        }) => (
          <Form autoComplete="off" noValidate>
            <div>
              <TextField
                id="outlined-title"
                label="title"
                name="title"
                value={values.title}
                error={(errors.title && touched.title) || false}
                helperText={errors.title && touched.title ? errors.title : null}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                variant="outlined"
              />
            </div>
            <div style={{ marginBottom: 30 }}>
              <Field
                name="startedAt"
                label="Дата работы (с)"
                validate={value => {
                  if (new Date(value) > new Date(values.expiredAt)) {
                    return "Не может быть больше даты окончания";
                  }
                }}
                component={DatePickerField}
              />
              <Field
                name="expiredAt"
                label="Дата работы (до)"
                validate={value => {
                  if (new Date(value) < new Date(values.startedAt)) {
                    return "Не может быть меньше даты окончания";
                  }
                }}
                component={DatePickerField}
              />
            </div>

            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>

            <Grid container>
              <Grid item xs={12} sm={12} style={{ margin: "24px" }}>
                {JSON.stringify({ errors, values }, null, 2)}
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    );
  };

  public render = () => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
        <div className="App">
          <h1>Test My Formik</h1>
          <div>{this.renderFormic()}</div>
        </div>
      </MuiPickersUtilsProvider>
    );
  };
}

export default App;
