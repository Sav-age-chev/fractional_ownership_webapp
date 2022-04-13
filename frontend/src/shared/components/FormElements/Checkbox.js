/*
 * [Checkbox] component used to implement checkbox elements and handle them
 */

//function
const Checkbox = (props) => {
  //object destructuring
  const { id, text, label, value, onChange } = props;

  return (
    <label>
      <input
        id={id}
        type="checkbox"
        label={label}
        checked={value}
        onChange={onChange}
      />
      {text}
    </label>
  );
};

//export function
export default Checkbox;
