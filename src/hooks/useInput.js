import { ref } from "vue";
export function useInput(initial = "") {
  const value = ref(initial);
  const onChange = (e) => { value.value = e.target.value; };
  return [value, onChange];
}
