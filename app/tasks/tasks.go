package tasks

import (
	"fmt"

	"github.com/k2glyph/meroedu/app/pkg/worker"
)

func describe(name string, job worker.Job) worker.Task {
	return worker.Task{Name: name, Job: job}
}

func link(baseURL, path string, args ...interface{}) string {
	return fmt.Sprintf("<a href='%[1]s%[2]s'>%[1]s%[2]s</a>", baseURL, fmt.Sprintf(path, args...))
}

func linkWithText(text, baseURL, path string, args ...interface{}) string {
	return fmt.Sprintf("<a href='%s%s'>%s</a>", baseURL, fmt.Sprintf(path, args...), text)
}
