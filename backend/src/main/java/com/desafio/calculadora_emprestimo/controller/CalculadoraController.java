package com.desafio.calculadora_emprestimo.controller;

import com.desafio.calculadora_emprestimo.dto.EmprestimoRequestDTO;
import com.desafio.calculadora_emprestimo.dto.ParcelaResponseDTO;
import com.desafio.calculadora_emprestimo.service.CalculadoraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calculadora")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CalculadoraController {

    @Autowired
    private CalculadoraService calculadoraService;

    @PostMapping("/calcular")
    public ResponseEntity<?> calcularEmprestimo(@RequestBody EmprestimoRequestDTO request) {
        try {
            List<ParcelaResponseDTO> resultado = calculadoraService.calcular(request);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro no cálculo: " + e.getMessage());
        }
    }
}