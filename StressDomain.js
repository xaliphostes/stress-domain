/**
 * @example
 * ```
 * const d = new StressDomain('visualization', 500, 500)
 * d.addPoint(0.5, 60)  // Normal fault regime
 * d.addPoint(1.5, 120) // Strike-slip fault regime
 * d.addPoint(2.5, 30)  // Reverse fault regime
 * ```
 */
class StressDomain {
    constructor(div, width, height) {
        const canvas = document.getElementById(div)
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        // Set up canvas for high-resolution displays
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`
        ctx.scale(dpr, dpr)

        const w = rect.width
        const h = rect.height

        this.width = w
        this.height = h
        this.margin = { top: 20, right: 20, bottom: 50, left: 40 }
        this.graphWidth = w - this.margin.left - this.margin.right
        this.graphHeight = h - this.margin.top - this.margin.bottom

        this.canvas = canvas
        this.ctx = ctx

        // Initial draw
        this.drawVisualization()
    }

    addPoint(R, theta) {
        const ctx = this.ctx

        // Convert R to Φ' based on the regime
        let phiPrime
        if (R >= 0 && R < 1) {
            phiPrime = R // Normal fault regime
        } else if (R >= 1 && R < 2) {
            phiPrime = 2 - R // Strike-slip fault regime
        } else if (R >= 2 && R <= 3) {
            phiPrime = R - 2 // Reverse fault regime
        } else {
            console.error("R value out of range (0-3)")
            return
        }
    
        // Calculate the position on the canvas
        const x = this.scaleX(R)
        const y = this.scaleY(theta)
    
        // Draw the point
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.strokeStyle = 'black'
        ctx.stroke()
        ctx.fillStyle = 'rgba(255, 127, 0, 0)'
        ctx.fillRect(this.scaleX(0), this.margin.top, this.graphWidth / 3, this.graphHeight)
    
        // Add a label
        ctx.fillStyle = 'black'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'bottom'
        ctx.font = '12px Arial'
        ctx.fillText(`(R=${R.toFixed(1)}, θ=${theta.toFixed(0)}°)`, x - 30, y - 10)
    }

    // ------------------- PRIVATE !

    // Helper functions
    scaleX(value) {
        return (value / 3) * this.graphWidth + this.margin.left
    }

    scaleY(value) {
        return this.graphHeight - (value / 180) * this.graphHeight + this.margin.top
    }

    drawVisualization() {
        const ctx = this.ctx
        const dpr = window.devicePixelRatio || 1

        // Clear canvas
        ctx.clearRect(0, 0, this.width * dpr, this.height * dpr)

        // Draw background rectangles
        ctx.fillStyle = 'rgba(255, 0, 0, 1)'
        ctx.fillRect(this.scaleX(0), this.margin.top, this.graphWidth / 3, this.graphHeight)
        ctx.fillStyle = 'rgba(0, 255, 0, 1)'
        ctx.fillRect(this.scaleX(1), this.margin.top, this.graphWidth / 3, this.graphHeight)
        ctx.fillStyle = 'rgba(0, 0, 255, 1)'
        ctx.fillRect(this.scaleX(2), this.margin.top, this.graphWidth / 3, this.graphHeight)

        // Draw axes
        ctx.beginPath()
        ctx.moveTo(this.margin.left, this.height - this.margin.bottom)
        ctx.lineTo(this.width - this.margin.right, this.height - this.margin.bottom)
        ctx.moveTo(this.margin.left, this.margin.top)
        ctx.lineTo(this.margin.left, this.height - this.margin.bottom)
        ctx.stroke()

        // Draw ticks and labels
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.font = '12px Arial'
        for (let i = 0; i <= 3; i++) {
            const x = this.scaleX(i)
            ctx.moveTo(x, this.height - this.margin.bottom)
            ctx.lineTo(x, this.height - this.margin.bottom + 5)
            ctx.fillText(i.toString(), x, this.height - this.margin.bottom + 10)
        }

        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        for (let i = 0; i <= 180; i += 45) {
            const y = this.scaleY(i)
            ctx.moveTo(this.margin.left - 5, y)
            ctx.lineTo(this.margin.left, y)
            ctx.fillText(i.toString(), this.margin.left - 10, y)
        }
        ctx.stroke()

        // Draw labels
        ctx.textAlign = 'center'
        ctx.font = '14px Arial'
        ctx.fillText("R", this.width / 2, this.height - 10)

        ctx.save()
        ctx.translate(this.margin.left - 30, this.height / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText("θ°", 0, 0)
        ctx.restore()

        // Draw regime labels
        ctx.textBaseline = 'bottom'
        ctx.fillText("Normal", this.scaleX(0.5), this.height - 25)
        ctx.fillText("Strike slip", this.scaleX(1.5), this.height - 25)
        ctx.fillText("Reverse", this.scaleX(2.5), this.height - 25)
    }
}
