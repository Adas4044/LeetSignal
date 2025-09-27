build:
	GOOS=linux GOARCH=amd64 go build -o cmd/lambda/bootstrap cmd/lambda/main.go
	@echo "✅ Build complete."
	@echo "======================================="
	@echo ""
	@echo "Next steps to deploy:"
	@echo "  - Guided deploy:   sam deploy --guided"
	@echo "  - Standard deploy: sam deploy"
	@echo ""

web:
	@echo "🏇 Starting LeetCode Horse Racing Web Server (Python)..."
	@echo "🌐 Open your browser to: http://localhost:8080"
	@echo "======================================="
	python3 scripts/racing_server.py

race: web

dev: web

.PHONY: build web race dev

web:
	@echo "🏇 Starting LeetCode Horse Racing Web Server..."
	@echo "🌐 Open your browser to: http://localhost:8080"
	@echo "======================================="
	@if command -v go >/dev/null 2>&1; then \
		go run cmd/web/main.go; \
	else \
		echo "Go not found, using Python server instead..."; \
		python3 scripts/racing_server.py; \
	fi

race: web

dev: web

python-server:
	@echo "🐍 Starting Python-based Racing Server..."
	python3 scripts/racing_server.py

.PHONY: build web race dev python-server