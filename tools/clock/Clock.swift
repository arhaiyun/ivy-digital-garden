import Cocoa

// MARK: - Views

final class ClockView: NSView {
    var onExit: (() -> Void)?

    override func mouseDown(with: NSEvent) {
        onExit?()
    }
}

// MARK: - App

final class ClockDelegate: NSObject, NSApplicationDelegate {
    private var window: NSWindow!
    private var label: NSTextField!
    private var timer: Timer?
    private var monitor: Any?
    private let selfTest: Bool
    private var selfTestTicks = 0

    init(selfTest: Bool = false) {
        self.selfTest = selfTest
    }

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.regular)

        guard let screen = NSScreen.main else {
            fputs("clock: 无法获取主屏幕\n", stderr)
            exit(1)
        }

        let frame = screen.frame
        let bg = NSColor(red: 0.02, green: 0.02, blue: 0.03, alpha: 1)

        let content = ClockView(frame: NSRect(origin: .zero, size: frame.size))
        content.wantsLayer = true
        content.layer?.backgroundColor = bg.cgColor
        content.onExit = { NSApp.terminate(nil) }

        label = NSTextField(labelWithString: "00:00:00")
        label.textColor = NSColor(red: 0.22, green: 1.0, blue: 0.08, alpha: 1)
        label.backgroundColor = .clear
        label.isBezeled = false
        label.isEditable = false
        label.alignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        content.addSubview(label)

        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: content.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: content.centerYAnchor),
        ])

        window = NSWindow(
            contentRect: frame,
            styleMask: [.borderless],
            backing: .buffered,
            defer: false,
            screen: screen
        )
        window.contentView = content
        window.backgroundColor = bg
        window.level = .screenSaver
        window.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        window.isOpaque = true
        window.hasShadow = false
        window.setFrame(frame, display: true)
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)

        monitor = NSEvent.addLocalMonitorForEvents(matching: .keyDown) { event in
            if event.keyCode == 53 {
                NSApp.terminate(nil)
                return nil
            }
            if event.charactersIgnoringModifiers?.lowercased() == "q" {
                NSApp.terminate(nil)
                return nil
            }
            return event
        }

        updateClock()

        timer = Timer.scheduledTimer(withTimeInterval: 0.15, repeats: true) { [weak self] _ in
            guard let self else { return }
            self.updateClock()
            if self.selfTest {
                self.selfTestTicks += 1
                if self.selfTestTicks >= 2 {
                    NSApp.terminate(nil)
                }
            }
        }
        RunLoop.main.add(timer!, forMode: .common)

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(updateClock),
            name: NSWindow.didResizeNotification,
            object: window
        )
    }

    @objc func updateClock() {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "HH:mm:ss"
        let text = formatter.string(from: Date())
        label.stringValue = text

        if selfTest {
            print(text)
            fflush(stdout)
        }

        let w = window.contentView?.bounds.width ?? 800
        let h = window.contentView?.bounds.height ?? 600
        let size = min(w / 5.5, h / 2.2)
        label.font = NSFont.monospacedDigitSystemFont(ofSize: max(size, 48), weight: .bold)
    }

    func applicationWillTerminate(_ notification: Notification) {
        timer?.invalidate()
        if let monitor {
            NSEvent.removeMonitor(monitor)
        }
    }
}

// MARK: - Entry

let selfTestMode = CommandLine.arguments.contains("--self-test")
let app = NSApplication.shared
let delegate = ClockDelegate(selfTest: selfTestMode)
app.delegate = delegate
app.run()
