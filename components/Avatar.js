import styles from "./Avatar.module.css";

export default function Avatar({ color }) {
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
      <img src="https://himg.bdimg.com/sys/portraitn/item/public.1.4be56046.AVtqaWrnKNxT21UzsZzuog" />
      </div>
      <div
        className={styles.color}
        style={{ border: `2px solid rgb(${color})` }}
      />
    </div>
  );
}
