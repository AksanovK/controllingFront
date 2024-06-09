import { useState } from 'react';

function useForm(initialValues, validate) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value,
        });
        if (validate) {
            setErrors(validate(values));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
            if (Object.keys(validationErrors).length === 0) {
                console.log('Форма отправлена', values);
            }
        }
    };

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
    };
}

export default useForm;
