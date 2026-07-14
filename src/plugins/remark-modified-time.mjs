import { execSync } from 'child_process'
import { statSync } from 'fs'

export function remarkModifiedTime() {
	return function (tree, file) {
		const filepath = file.history[0]
		const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`).toString().trim()
		if (result) {
			file.data.astro.frontmatter.lastModified = result
		} else {
			// Fallback to file system mtime (e.g. for uncommitted files in local dev)
			file.data.astro.frontmatter.lastModified = statSync(filepath).mtime.toISOString()
		}
	}
}
