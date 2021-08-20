export type Nullable<T> = T | null
export type RequiredNonNull<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
}
export type DeepRequiredNonNull<T> = {
    [P in keyof T]-?: DeepRequiredNonNull<NonNullable<T[P]>>;
}
export type DeepWriteable<T> = {
    -readonly [P in keyof T]: DeepWriteable<T[P]>
};
