export default {
  '**/*.ts': fileNames => [
    `tsc --showConfig -p tsconfig-lint-staged.json | \
      jq -j '.compilerOptions | to_entries | map("--" + .key + " " + (.value | if type=="array" then join(",") else . end | tostring)) | @sh' | \
      xargs -t -I {} sh -c 'tsc --noEmit {} ${fileNames.join(' ')}'`,
  ],
}
