import styles from "./stylev2.module.css";
const LoaderV2 = () => {
    return (
        <div className={styles.gearbox}>
            <div className={styles.overlay}></div>
            <div className={`${styles.gear} ${styles.one}`}>
                <div className={styles.gearInner}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                </div>
            </div>
            <div className={`${styles.gear} ${styles.two}`}>
                <div className={styles.gearInner}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                </div>
            </div>
            <div className={`${styles.gear} ${styles.three}`}>
                <div className={styles.gearInner}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                </div>
            </div>
            <div className={`${styles.gear} ${styles.four} ${styles.large}`}>
                <div className={styles.gearInner}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                </div>
            </div>
        </div>
    )
}
export default LoaderV2