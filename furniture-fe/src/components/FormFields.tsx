import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Typography, FormControlLabel, Checkbox, Select, InputLabel, FormControl, FormHelperText, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import { useFormik } from 'formik';

const MyStyledTextarea = styled('textarea')(
    ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? '#C7D0DD' : '#303740'};
    background: ${theme.palette.mode === 'dark' ? '#1C2025' : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? '#434D5B' : '#DAE2ED'};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? '#1C2025' : '#F3F6F9'};

    &:hover {
      border-color: #3399FF;
    }

    &:focus {
      border-color: #3399FF;
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? '#0072E5' : '#b6daff'};
    }

    &:focus-visible {
      outline: 0;
    }
  `,
);

interface IMyTextAreaProps {
    formik: ReturnType<typeof useFormik>;
    name: string;
    label: string;
}

export const MyTextArea: React.FC<IMyTextAreaProps> = ({ formik, name, label }) => {
    const error = formik.touched[name] && Boolean(formik.errors[name]);
    const helperText = formik.touched[name] ? formik.errors[name] : '';

    return (
        <div style={{ marginBottom: '16px' }}>
            <label htmlFor={name} style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                {label}
            </label>
            <MyStyledTextarea
                id={name}
                name={name}
                value={formik.values[name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
                style={error ? { borderColor: '#FF0000' } : {}}
            />
            {helperText && (
                <div style={{ color: '#FF0000', marginTop: '8px', fontSize: '0.75rem' }}>
                    {helperText}
                </div>
            )}
        </div>
    );
};

interface IMyTextInput {
    formik: any,
    name: string,
    label: string,
    type?: string,
}

export const MyTextInput = ({formik, name, label, type}: IMyTextInput) => {
  return (
    <TextField
        fullWidth
        id={name}
        name={name}
        label={label}
        type={type}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
    />
  );
};

interface IMyCheckBox {
  formik: any,
  name: string,
  label: string,
}

export const MyCheckbox = ({formik, name, label}: IMyCheckBox) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={formik.values[name]} />}
      label={label}
      name={name}
      onChange={() =>
        formik.setFieldValue(
          name,
          !formik.values[name],
        )
      }
    />
  );
};
interface IMySelect {
  formik: any,
  name: string,
  label: string,
  options: {id: number, name: string}[];
}

export const MySelect = ({formik, name, label, options}: IMySelect) => {
  return (
    <FormControl sx={{ minWidth: 120 }}>
      <InputLabel id="my_select">{label}</InputLabel>
      <Select
        labelId="my_select"
        id="select-helper"
        value={formik.values[name].toString()}
        label={label}
        onChange={(_evt, value ) => formik.setFieldValue(name, (value as { props: {value: string}}).props.value)}
      >
        {options.map(item => <MenuItem value={item.id.toString()}>{item.name}</MenuItem>)}
      </Select>
      {formik.touched[name] && Boolean(formik.errors[name]) && <FormHelperText sx={{color: '#d32f2f', ml: '14px', mt: '3px', fontSize: '0.75rem'}}>
            {formik.errors[name]}
        </FormHelperText>}
  </FormControl>
  );
};

interface IMyMultiSelect {
    formik: any,
    name: string,
    label: string,
    options: unknown[],
    initialValues?: unknown[],
}

export const MyMultiSelect = ({formik, name, label, options, initialValues = []}: IMyMultiSelect) => {
  return (
    <Box>
        <Autocomplete
            multiple
            disablePortal
            getOptionLabel={(option) => option.name}
            defaultValue={initialValues}
            id={name}
            sx={{ width: 300 }}
            value={formik.values[name]}
            options={options}
            onChange={(_evt, value ) => formik.setFieldValue(name, value)}
            onBlur={formik.handleBlur}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
        {formik.touched[name] && Boolean(formik.errors[name]) && <Typography sx={{color: '#d32f2f', ml: '14px', mt: '3px', fontSize: '0.75rem'}} variant="body2" component="p">
            {formik.errors[name]}
        </Typography>}
    </Box>
  );
};
